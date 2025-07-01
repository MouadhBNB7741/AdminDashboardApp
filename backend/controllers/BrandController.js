import prisma from "../services/prisma";
import * as zod from "zod";
import {
  createBrandSchema,
  updateBrandSchema,
  createProductVariantSchema,
  updateProductVariantSchema,
  setProductPricingSchema,
  updateProductPricingSchema,
} from "../validators/Brand";

export const createBrand = async (req, res) => {
  try {
    const parsed = createBrandSchema.parse(req.body);

    const existingBrand = await prisma.brand.findUnique({
      where: { name: parsed.name },
    });

    if (existingBrand) {
      return res.status(400).json({ error: "Brand already exists" });
    }

    const brand = await prisma.brand.create({
      parsed,
    });

    res.status(201).json({
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating brand:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);
    const parsed = updateBrandSchema.parse(req.body);

    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!existingBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      parsed,
    });

    res.json({
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating brand:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    await prisma.brand.delete({
      where: { id: brandId },
    });

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createProductVariant = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const parsed = createProductVariantSchema.parse(req.body);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const variant = await prisma.productVariant.create({
      data: {
        ...parsed,
        product_id: productId,
      },
    });

    res.status(201).json({
      message: "Variant created successfully",
      variant,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating variant:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllVariantsByProductId = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    const variants = await prisma.productVariant.findMany({
      where: { product_id: productId },
    });

    res.json(variants);
  } catch (error) {
    console.error("Error fetching variants:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getVariantById = async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
      },
    });

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json(variant);
  } catch (error) {
    console.error("Error fetching variant:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProductVariant = async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);
    const parsed = updateProductVariantSchema.parse(req.body);

    const existingVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!existingVariant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      parsed,
    });

    res.json({
      message: "Variant updated successfully",
      variant: updatedVariant,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating variant:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProductVariant = async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    res.json({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const setProductPricing = async (req, res) => {
  try {
    const parsed = setProductPricingSchema.parse(req.body);

    const {
      product_id,
      variant_id,
      customer_type,
      base_price,
      sale_price,
      valid_from,
      valid_until,
      is_active,
    } = parsed;

    if (variant_id) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variant_id },
      });

      if (!variant || variant.product_id !== product_id) {
        return res
          .status(400)
          .json({ error: "Invalid product-variant relationship" });
      }
    } else {
      const product = await prisma.product.findUnique({
        where: { id: product_id },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
    }

    const pricing = await prisma.productPricing.create({
      data: {
        product_id,
        variant_id,
        customer_type,
        base_price,
        sale_price,
        valid_from,
        valid_until,
        is_active,
      },
    });

    res.status(201).json({
      message: "Pricing created successfully",
      pricing,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error setting pricing:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPricingByProductOrVariant = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const variantId = parseInt(req.params.variantId);

    let pricing;
    if (variantId) {
      pricing = await prisma.productPricing.findMany({
        where: { variant_id: variantId },
        include: {
          variant: true,
        },
      });
    } else if (productId) {
      pricing = await prisma.productPricing.findMany({
        where: { product_id: productId },
        include: {
          product: true,
        },
      });
    } else {
      return res.status(400).json({ error: "Missing product or variant ID" });
    }

    res.json(pricing);
  } catch (error) {
    console.error("Error fetching pricing:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProductPricing = async (req, res) => {
  try {
    const pricingId = parseInt(req.params.pricingId);
    const parsed = updateProductPricingSchema.parse(req.body);

    const existingPricing = await prisma.productPricing.findUnique({
      where: { id: pricingId },
    });

    if (!existingPricing) {
      return res.status(404).json({ error: "Pricing not found" });
    }

    const updatedPricing = await prisma.productPricing.update({
      where: { id: pricingId },
      parsed,
    });

    res.json({
      message: "Pricing updated successfully",
      pricing: updatedPricing,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating pricing:", error);
    res.status(500).json({ error: "Server error" });
  }
};
