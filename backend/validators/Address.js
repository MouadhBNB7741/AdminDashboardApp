const zod = require("zod");

export const createUserAddressSchema = zod.object({
  user_id: zod.number().int(),
  wilaya_id: zod.number().int(),
  commune_id: zod.number().int(),
  address_line1: zod.string(),
  address_line2: zod.string().optional(),
  postal_code: zod.string().optional(),
  landmark: zod.string().optional(),
  phone: zod.string().optional(),
  is_default: zod.boolean().optional().default(false),
  address_type: zod.enum(["HOME", "WORK", "OTHER"]).optional().default("HOME"),
  recipient_name: zod.string().optional(),
  notes: zod.string().optional(),
});

export const updateUserAddressSchema = createUserAddressSchema
  .partial()
  .required({});

export const setDefaultAddressSchema = zod.object({
  addressId: zod.number().int(),
  userId: zod.number().int(),
});
