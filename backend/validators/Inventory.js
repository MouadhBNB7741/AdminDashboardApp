import * as zod from "zod";

export const InventoryUpdateSchema = object({
  productId: zod.number().positive(),
  variantId: zod.number().positive().optional(),
  changeQuantity: zod.number().int(),
  reason: zod.string().optional(),
});

export const InventoryStatusSchema = object({
  productId: zod.number().positive(),
  variantId: zod.number().positive().optional(),
});

export const InventoryLogFilterSchema = object({
  productId: zod.number().positive().optional(),
  variantId: zod.number().positive().optional(),
  supplierId: zod.number().positive().optional(),
  startDate: zod.date().optional(),
  endDate: zod.date().optional(),
  page: zod.number().positive().default(1),
  limit: zod.number().positive().default(20),
});
