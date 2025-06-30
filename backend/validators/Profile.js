import * as zod from "zod";

export const createCustomerProfileSchema = zod.object({
  user_id: zod.number().int(),
  date_of_birth: zod.date().optional(),
  gender: zod.enum(["male", "female"]).optional(),
  national_id: zod.string().optional(),
  profession: zod.string().optional(),
  medical_license: zod.string().optional(),
  organization_name: zod.string().optional(),
  organization_type: zod
    .enum(["hospital", "clinic", "pharmacy", "individual"])
    .optional(),
  tax_number: zod.string().optional(),
});

export const updateCustomerProfileSchema =
  createCustomerProfileSchema.partial();

export const createSupplierProfileSchema = zod.object({
  user_id: zod.number().int(),
  company_name: zod.string(),
  company_registration: zod.string(),
  tax_number: zod.string(),
  business_type: zod.enum([
    "manufacturer",
    "distributor",
    "retailer",
    "importer",
  ]),
  medical_license: zod.string().optional(),
  verification_status: zod
    .enum(["pending", "approved", "rejected"])
    .default("pending"),
  verification_documents: zod.any().optional(),
  annual_revenue: zod.number().optional(),
  established_year: zod.number().int().optional(),
  employee_count: zod.number().int().optional(),
  warehouse_capacity: zod.number().int().optional(),
  subscription_type: zod
    .enum(["basic", "premium", "enterprise"])
    .default("basic"),
  subscription_expires_at: zod.date().optional(),
  commission_rate: zod.number().default(5.0),
});

export const updateSupplierProfileSchema =
  createSupplierProfileSchema.partial();
