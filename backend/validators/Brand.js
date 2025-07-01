import * as zod from "zod";

export const createBrandSchema = zod.object({
  name: zod.string().min(1, "Brand name is required"),
  description_ar: zod.string().optional(),
  description_fr: zod.string().optional(),
  description_en: zod.string().optional(),
  logo_url: zod.string().url().optional(),
  website: zod.string().url().optional(),
  country_origin: zod.string().optional(),
  is_active: zod.boolean().optional().default(true),
});

export const updateBrandSchema = createBrandSchema.partial();

export const createProductVariantSchema = zod.object({
  product_id: zod.number().int(),
  variant_name: zod.string().min(1, "Variant name is required"),
  variant_value: zod.string().min(1, "Variant value is required"),
  sku: zod.string().optional(),
  barcode: zod.string().optional(),
  price_adjustment: zod.number().optional().default(0),
  weight_adjustment: zod.number().optional().default(0),
  stock_quantity: zod.number().int().optional().default(0),
  is_active: zod.boolean().optional().default(true),
});

export const updateProductVariantSchema = createProductVariantSchema
  .omit({ product_id: true })
  .partial();

export const setProductPricingSchema = zod.object({
  product_id: zod.number().int(),
  variant_id: zod.number().int().optional(),
  customer_type: zod.enum(["RETAIL", "WHOLESALE", "HOSPITAL", "PHARMACY"]),
  min_quantity: zod.number().int().positive().default(1),
  max_quantity: zod.number().int().optional(),
  base_price: zod.number().positive(),
  sale_price: zod.number().optional(),
  cost_price: zod.number().optional(),
  margin_percentage: zod.number().optional(),
  currency: zod.string().default("DZD"),
  valid_from: zod.date().optional().default(new Date()),
  valid_until: zod.date().optional(),
  is_active: zod.boolean().optional().default(true),
});

export const updateProductPricingSchema = setProductPricingSchema
  .omit({ product_id: true })
  .partial()
  .extend({
    variant_id: zod.number().int().optional(),
  });
