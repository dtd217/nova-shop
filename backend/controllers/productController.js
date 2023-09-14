import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

// Payment gateway
var gateway = new braintree.BraintreeGateway({
   environment: braintree.Environment.Sandbox,
   merchantId: process.env.BRAINTREE_MERCHANT_ID,
   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Create product
export const createProductController = async (req, res) => {
   try {
      const { name, description, price, category, quantity, shipping } = req.fields
      const { photo } = req.files;

      // Validation
      switch (true) {
         case !name:
            return res.status(500).send({ error: "Name is Required" });
         case !description:
            return res.status(500).send({ error: "Description is Required" });
         case !price:
            return res.status(500).send({ error: "Price is Required" });
         case !category:
            return res.status(500).send({ error: "Category is Required" });
         case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
         case !shipping:
            return res.status(500).send({ error: "Shipping is Required" });
         case photo && photo.size > 1000000:
            return res.status(500).send({ error: "Photo is Required and should be less than 1mb" });
      }

      const products = new productModel({ ...req.fields, slug: slugify(name) });
      if (photo) {
         products.photo.data = fs.readFileSync(photo.path);
         products.photo.contentType = photo.type;
      }

      await products.save();
      res.status(201).send({
         success: true,
         message: "Product created successfully",
         products
      })
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Create Product"
      })
   }
}

// Get all product
export const getProductController = async (req, res) => {
   try {
      const products = await productModel
         .find({})
         .populate("category")
         .select("-photo")
         .limit(12)
         .sort({ createdAt: -1 });
      res.status(200).send({
         success: true,
         counTotal: products.length,
         message: "All Products",
         products,
      });
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Get Products"
      })
   }
}

// Get single product
export const getSingleProductController = async (req, res) => {
   try {
      const product = await productModel
         .findOne({ slug: req.params.slug })
         .select("-photo")
         .populate("category");
      res.status(200).send({
         success: true,
         message: "Single Product",
         product,
      });
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Get Single Product"
      })
   }
}

// Get product photo
export const getProductPhotoController = async (req, res) => {
   try {
      const product = await productModel.findById(req.params.pid).select("photo");
      if (product.photo.data) {
         res.set("Content-type", product.photo.contentType);
         return res.status(200).send(product.photo.data);
      }
      return res.status(200).send(product.photo.data);
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Get Product Photo"
      })
   }
}

// Delete product
export const deleteProductController = async (req, res) => {
   try {
      await productModel.findByIdAndDelete(req.params.pid).select("-photo");
      res.status(200).send({
         success: true,
         message: "Product deleted successfully",
      });
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Delete Product"
      })
   }
}

// Update product
export const updateProductController = async (req, res) => {
   try {
      const { name, description, price, category, quantity, shipping } = req.fields;
      const { photo } = req.files;

      //Validation
      switch (true) {
         case !name:
            return res.status(500).send({ error: "Name is Required" });
         case !description:
            return res.status(500).send({ error: "Description is Required" });
         case !price:
            return res.status(500).send({ error: "Price is Required" });
         case !category:
            return res.status(500).send({ error: "Category is Required" });
         case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
         case !shipping:
            return res.status(500).send({ error: "Shipping is Required" });
         case photo && photo.size > 1000000:
            return res.status(500).send({ error: "Photo is Required and should be less than 1mb" });
      }

      const products = await productModel.findByIdAndUpdate(
         req.params.pid,
         { ...req.fields, slug: slugify(name) },
         { new: true }
      );

      if (photo) {
         products.photo.data = fs.readFileSync(photo.path);
         products.photo.contentType = photo.type;
      }

      await products.save();
      res.status(201).send({
         success: true,
         message: "Product Updated Successfully",
         products,
      });
   } catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Update product",
      });
   }
}

// Filter product 
export const filterProductController = async (req, res) => {
   try {
      const { checked, radio } = req.body
      let args = {}
      if (checked.length > 0) {
         args.category = checked
      }
      if (radio.length > 0) {
         args.price = { $gte: radio[0], $lte: radio[1] }
      }
      const products = await productModel.find(args)
      res.status(200).send({
         success: true,
         products,
      });
   }
   catch (error) {
      console.log(error);
      res.status(400).send({
         success: false,
         error,
         message: "Error in Filter Product"
      })
   }
}

// Count product 
export const countProductController = async (req, res) => {
   try {
      const total = await productModel.find({}).estimatedDocumentCount();
      res.status(200).send({
         success: true,
         total,
      });
   }
   catch (error) {
      console.log(error);
      res.status(400).send({
         success: false,
         error,
         message: "Error in Count Product"
      })
   }
}

// Get product per page
export const listProductController = async (req, res) => {
   try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
      const products = await productModel
         .find({})
         .select("-photo")
         .skip((page - 1) * perPage)
         .limit(perPage)
         .sort({ createdAt: -1 });
      res.status(200).send({
         success: true,
         products,
      })
   }
   catch (error) {
      console.log(error);
      res.status(400).send({
         success: false,
         error,
         message: "Error in Get Products"
      })
   }
}

// Search product
export const searchProductController = async (req, res) => {
   try {
      const { keyword } = req.params
      const resutls = await productModel
         .find({
            $or: [
               { name: { $regex: keyword, $options: "i" } },
               { description: { $regex: keyword, $options: "i" } },
            ],
         })
         .select("-photo");
      res.json(resutls);
   }
   catch (error) {
      console.log(error);
      res.status(400).send({
         success: false,
         error,
         message: "Error in Search Product"
      })
   }
}

// Similar product
export const relatedProductController = async (req, res) => {
   try {
      const { pid, cid } = req.params
      const products = await productModel
         .find({ _id: { $ne: pid }, category: cid })
         .select("-photo").limit(4).populate("category");
      res.status(200).send({
         success: true,
         products,
      })
   }
   catch (error) {
      console.log(error);
      res.status(400).send({
         success: false,
         error,
         message: "Error in Related Product"
      })
   }
}

// Category product
export const categoryProductController = async (req, res) => {
   try {
      const category = await categoryModel.findOne({ slug: req.params.slug });
      const products = await productModel.find({ category }).populate("category");
      res.status(200).send({
         success: true,
         category,
         products,
      })
   }
   catch (error) {
      console.log(error);
      res.status(400).send({
         success: false,
         error,
         message: "Error in Category Product"
      })
   }
}

// Payment gateway api
// Token
export const braintreeTokenController = async (req, res) => {
   try {
      gateway.clientToken.generate({}, function (err, response) {
         if (err) {
            res.status(500).send(err);
         }
         else {
            res.send(response);
         }
      })
   }
   catch (error) {
      console.log(error);
   }
}

// Payment
export const braintreePaymentController = async (req, res) => {
   try {
      const { cart, nonce } = req.body
      let total = 0
      cart.map((item) => { total += item.price });
      var newTransaction = gateway.transaction.sale(
         {
            amount: total,
            paymentMethodNonce: nonce,
            options: {
               submitForSettlement: true,
            },
         },
         function (error, result) {
            if (result) {
               const order = new orderModel({
                  products: cart,
                  payment: result,
                  buyer: req.user._id,
               }).save();
               res.json({ ok: true });
            } else {
               res.status(500).send(error);
            }
         }
      );
   }
   catch (error) {
      console.log(error);
   }
}