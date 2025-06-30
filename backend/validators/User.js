import * as zod from "zod";

export const registerSchema = zod.object({
  email: zod.string().email(),
  phone: zod.string().optional(),
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
  userType: zod.enum(["CUSTOMER", "SUPPLIER", "ADMIN", "DELIVERY"]),
  language: zod.enum(["AR", "FR", "EN"]).optional().default("EN"),
});

export const loginSchema = zod.object({
  email: zod.string().email().optional(),
  phone: zod.string().optional(),
  password: zod.string(),
});

export const forgotPasswordSchema = zod.object({
  email: zod.string().email(),
});

export const resetPasswordSchema = zod.object({
  token: zod.string(),
  newPassword: zod.string().min(6),
});

export const enable2FASchema = zod.object({
  userId: zod.number().int(),
  enable: zod.boolean(),
});

export const verify2FACodeSchema = zod.object({
  userId: zod.number().int(),
  code: zod.string(),
});

export const verifyEmailSchema = zod.object({
  token: zod.string(),
});

export const updateUserSchema = zod.object({
  email: zod.string().email().optional(),
  phone: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  userType: zod.enum(["CUSTOMER", "SUPPLIER", "ADMIN", "DELIVERY"]).optional(),
  language: zod.enum(["AR", "FR", "EN"]).optional(),
  status: zod.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]).optional(),
  darkMode: zod.boolean().optional(),
});

export const adminCreateUserSchema = zod.object({
  email: zod.string().email(),
  phone: zod.string().optional(),
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
  userType: zod.enum(["CUSTOMER", "SUPPLIER", "ADMIN", "DELIVERY"]),
  language: zod.enum(["AR", "FR", "EN"]).default("AR"),
  status: zod
    .enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"])
    .default("PENDING"),
  darkMode: zod.boolean().optional().default(false),

  customerProfile: zod
    .object({
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
    })
    .optional(),

  supplierProfile: zod
    .object({
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
    })
    .optional(),
});
