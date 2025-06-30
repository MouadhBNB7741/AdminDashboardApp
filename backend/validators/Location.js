import zod from "zod";

export const createWilayaSchema = zod.object({
  code: zod.string(),
  name_ar: zod.string(),
  name_fr: zod.string(),
  name_en: zod.string(),
  delivery_fee: zod.number().optional().default(0.0),
  is_active: zod.boolean().optional().default(true),
});

export const updateWilayaSchema = createWilayaSchema.partial();

export const createCommuneSchema = zod.object({
  wilaya_id: zod.number().int(),
  code: zod.string(),
  name_ar: zod.string(),
  name_fr: zod.string(),
  name_en: zod.string(),
  postal_code: zod.string().optional(),
  additional_delivery_fee: zod.number().optional().default(0.0),
  is_active: zod.boolean().optional().default(true),
});

export const updateCommuneSchema = createCommuneSchema.partial();
