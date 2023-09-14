import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Create category controller
export const createCategoryController = async (req, res) => {
   try {
      const { name } = req.body;
      // Validation
      if (!name) {
         return res.status(401).send({
            success: false,
            message: "Name is required"
         })
      }

      const existingCategory = await categoryModel.findOne({ name });
      if (existingCategory) {
         return res.status(200).send({
            success: false,
            message: "Category already exists"
         })
      }

      const category = await new categoryModel({ name, slug: slugify(name) }).save();
      res.status(201).send({
         success: true,
         message: "Category created successfully",
         category,
      })

   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Create Category"
      })
   }
}

// Update category controller
export const updateCategoryController = async (req, res) => {
   try {
      const { name } = req.body;
      const { id } = req.params;
      const category = await categoryModel.findByIdAndUpdate(
         id,
         { name, slug: slugify(name) },
         { new: true }
      );

      res.status(200).send({
         success: true,
         message: "Category updated successfully",
         category
      })
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Update Category"
      })
   }
}

// Get all categories controller
export const categoryControlller = async (req, res) => {
   try {
      const categories = await categoryModel.find();
      res.status(200).send({
         success: true,
         message: "Categories fetched successfully",
         categories
      })
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Get Categories"
      })
   }
}

// Get single category controller
export const singleCategoryControlller = async (req, res) => {
   try {
      const category = await categoryModel.findOne({ slug: req.params.slug });
      res.status(200).send({
         success: true,
         message: "Category fetched successfully",
         category
      })
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Get Single Category"
      })
   }
}

// Delete category controller
export const deleteCategoryController = async (req, res) => {
   try {
      const { id } = req.params;
      await categoryModel.findByIdAndDelete(id);
      res.status(200).send({
         success: true,
         message: "Category deleted successfully",
      })
   }
   catch (error) {
      console.log(error);
      res.status(500).send({
         success: false,
         error,
         message: "Error in Delete Category"
      })
   }
}