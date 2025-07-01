import prisma from "../services/prisma";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/Category";
import * as zod from "zod";

export const createCategory = async (req, res) => {
  try {
    const parsed = createCategorySchema.parse(req.body);

    if (parsed.parent_id) {
      const parent = await prisma.category.findUnique({
        where: { id: parsed.parent_id },
      });

      if (!parent) {
        return res.status(400).json({ error: "Parent category not found" });
      }
    }

    const category = await prisma.category.create({
      parsed,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parent_id: null,
      },
      include: {
        children: true,
      },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const parsed = updateCategorySchema.parse(req.body);

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (parsed.parent_id === categoryId) {
      return res
        .status(400)
        .json({ error: "A category cannot be its own parent" });
    }

    if (parsed.parent_id) {
      const parent = await prisma.category.findUnique({
        where: { id: parsed.parent_id },
      });

      if (!parent) {
        return res.status(400).json({ error: "Parent category not found" });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      parsed,
    });

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category.children || []);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Server error" });
  }
};
