import prisma from "../services/prisma";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/Product";
import path from "path";
import * as zod from "zod";
import * as fs from "fs";

export const createProduct = async (req, res) => {
  try {
    const parsed = createProductSchema.parse(req.body);

    const supplier = await prisma.user.findUnique({
      where: { id: parsed.supplier_id },
      select: { user_type: true },
    });

    if (!supplier || supplier.user_type !== "SUPPLIER") {
      return res.status(400).json({ error: "Invalid supplier" });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsed.category_id },
    });

    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }

    if (parsed.brand_id) {
      const brand = await prisma.brand.findUnique({
        where: { id: parsed.brand_id },
      });

      if (!brand) {
        return res.status(400).json({ error: "Invalid brand" });
      }
    }

    const product = await prisma.product.create({
      parsed,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        supplier: true,
        ProductPricing: true,
        ProductInventory: true,
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        brand: true,
        category: true,
        supplier: true,
        ProductImage: true,
        ProductPricing: true,
        ProductInventory: true,
        ProductReview: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const parsed = updateProductSchema.parse(req.body);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      parsed,
    });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query, category, brand, minPrice, maxPrice } = req.query;

    const whereClause = {};

    if (query) {
      whereClause.OR = [
        { name_ar: { contains: query, mode: "insensitive" } },
        { name_fr: { contains: query, mode: "insensitive" } },
        { name_en: { contains: query, mode: "insensitive" } },
        { description_ar: { contains: query, mode: "insensitive" } },
        { description_fr: { contains: query, mode: "insensitive" } },
        { description_en: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      whereClause.category_id = parseInt(category);
    }

    if (brand) {
      whereClause.brand_id = parseInt(brand);
    }

    if (minPrice || maxPrice) {
      whereClause.ProductPricing = {};
      if (minPrice) whereClause.ProductPricing.min_price = parseFloat(minPrice);
      if (maxPrice) whereClause.ProductPricing.max_price = parseFloat(maxPrice);
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        brand: true,
        category: true,
        supplier: true,
        ProductPricing: true,
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const filterProductsByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const products = await prisma.product.findMany({
      where: { category_id: categoryId },
    });

    res.json(products);
  } catch (error) {
    console.error("Error filtering products by category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const filterProductsByBrand = async (req, res) => {
  try {
    const brandId = parseInt(req.params.brandId);

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const products = await prisma.product.findMany({
      where: { brand_id: brandId },
    });

    res.json(products);
  } catch (error) {
    console.error("Error filtering products by brand:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const uploadProductImages = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const imageRecords = req.files.map((file) => {
      const imageUrl = `/uploads/product-images/${file.filename}`;
      return {
        product_id: productId,
        image_url: imageUrl,
        is_primary: false,
      };
    });

    const uploadedImages = await prisma.productImage.createMany({
      imageRecords,
    });

    res.status(201).json({
      message: "Images uploaded successfully",
      count: uploadedImages.count,
      images: imageRecords,
    });
  } catch (error) {
    console.error("Error uploading product images:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductImages = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    const images = await prisma.productImage.findMany({
      where: { product_id: productId },
      select: {
        id: true,
        image_url: true,
        alt_text: true,
        sort_order: true,
        is_primary: true,
        created_at: true,
      },
    });

    res.json(images);
  } catch (error) {
    console.error("Error fetching product images:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const imageId = parseInt(req.params.imageId);

    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imagePath = path.join(
      __dirname,
      "../../uploads/product-images",
      path.basename(image.image_url)
    );

    try {
      fs.unlink(imagePath);
    } catch (err) {
      console.warn("File not found locally, skipping deletion");
    }

    await prisma.productImage.delete({
      where: { id: imageId },
    });

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res.status(500).json({ error: "Server error" });
  }
};
