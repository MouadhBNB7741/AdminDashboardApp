import * as zod from "zod";

export const createProductSchema = zod.object({
  supplier_id: zod.number().int(),
  category_id: zod.number().int(),
  brand_id: zod.number().int().optional(),
  sku: zod.string(),
  barcode: zod.string().optional(),
  name_ar: zod.string(),
  name_fr: zod.string(),
  name_en: zod.string(),
  description_ar: zod.string().optional(),
  description_fr: zod.string().optional(),
  description_en: zod.string().optional(),
  short_description_ar: zod.string().optional(),
  short_description_fr: zod.string().optional(),
  short_description_en: zod.string().optional(),
  specifications: zod.record(zod.any()).optional(),
  ingredients: zod.string().optional(),
  usage_instructions_ar: zod.string().optional(),
  usage_instructions_fr: zod.string().optional(),
  usage_instructions_en: zod.string().optional(),
  warnings_ar: zod.string().optional(),
  warnings_fr: zod.string().optional(),
  warnings_en: zod.string().optional(),
  requires_prescription: zod.boolean().optional().default(false),
  prescription_type: zod
    .enum(["none", "otc", "prescription", "controlled"])
    .optional()
    .default("none"),
  age_restriction: zod.number().int().optional(),
  weight: zod.number().optional(),
  dimensions: zod.string().optional(),
  material: zod.string().optional(),
  sterile: zod.boolean().optional().default(false),
  disposable: zod.boolean().optional().default(false),
  expiry_tracking: zod.boolean().optional().default(false),
  batch_tracking: zod.boolean().optional().default(false),
  status: zod
    .enum(["draft", "pending", "active", "inactive", "discontinued"])
    .default("draft"),
  approval_status: zod
    .enum(["pending", "approved", "rejected"])
    .default("pending"),
  rejection_reason: zod.string().optional(),
  meta_title: zod.string().optional(),
  meta_description: zod.string().optional(),
  meta_keywords: zod.string().optional(),
  slug: zod.string().min(3),
  featured: zod.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema.partial();

export const uploadProductImagesSchema = zod.object({
  product_id: zod.number().int(),
  images: zod.array(zod.string()),
});
