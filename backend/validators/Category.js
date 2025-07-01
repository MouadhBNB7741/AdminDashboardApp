import * as zod from "zod";

export const createCategorySchema = zod.object({
  parent_id: zod.number().int().optional(),
  name_ar: zod.string(),
  name_fr: zod.string(),
  name_en: zod.string(),
  description_ar: zod.string().optional(),
  description_fr: zod.string().optional(),
  description_en: zod.string().optional(),
  icon: zod.string().optional(),
  image_url: zod.string().optional(),
  sort_order: zod.number().int().optional().default(0),
  is_active: zod.boolean().optional().default(true),
  seo_title: zod.string().optional(),
  seo_description: zod.string().optional(),
  seo_keywords: zod.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
