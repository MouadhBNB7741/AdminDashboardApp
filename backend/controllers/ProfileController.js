import prisma from "../services/prisma";
import {
  createCustomerProfileSchema,
  createSupplierProfileSchema,
  updateCustomerProfileSchema,
  updateSupplierProfileSchema,
} from "../validators/Profile";

export const createCustomerProfile = async (req, res) => {
  try {
    const parsed = createCustomerProfileSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: parsed.user_id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingProfile = await prisma.customerProfile.findFirst({
      where: { user_id: parsed.user_id },
    });

    if (existingProfile) {
      return res.status(400).json({ error: "Customer profile already exists" });
    }

    const profile = await prisma.customerProfile.create({
      parsed,
    });

    res.status(201).json({
      message: "Customer profile created successfully",
      profile,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating customer profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCustomerProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const profile = await prisma.customerProfile.findFirst({
      where: { user_id: userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Customer profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCustomerProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const parsed = updateCustomerProfileSchema.parse(req.body);

    const existingProfile = await prisma.customerProfile.findFirst({
      where: { user_id: userId },
    });

    if (!existingProfile) {
      return res.status(404).json({ error: "Customer profile not found" });
    }

    const updatedProfile = await prisma.customerProfile.update({
      where: { id: existingProfile.id },
      parsed,
    });

    res.json({
      message: "Customer profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating customer profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteCustomerProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const profile = await prisma.customerProfile.findFirst({
      where: { user_id: userId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Customer profile not found" });
    }

    await prisma.customerProfile.delete({
      where: { id: profile.id },
    });

    res.json({
      message: "Customer profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Supplier
export const createSupplierProfile = async (req, res) => {
  try {
    const parsed = createSupplierProfileSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: parsed.user_id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingProfile = await prisma.supplierProfile.findFirst({
      where: { user_id: parsed.user_id },
    });

    if (existingProfile) {
      return res.status(400).json({ error: "Supplier profile already exists" });
    }

    const profile = await prisma.supplierProfile.create({
      parsed,
    });

    res.status(201).json({
      message: "Supplier profile created successfully",
      profile,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating supplier profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSupplierProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const profile = await prisma.supplierProfile.findFirst({
      where: { user_id: userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Supplier profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching supplier profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateSupplierProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const parsed = updateSupplierProfileSchema.parse(req.body);

    const existingProfile = await prisma.supplierProfile.findFirst({
      where: { user_id: userId },
    });

    if (!existingProfile) {
      return res.status(404).json({ error: "Supplier profile not found" });
    }

    const updatedProfile = await prisma.supplierProfile.update({
      where: { id: existingProfile.id },
      parsed,
    });

    res.json({
      message: "Supplier profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating supplier profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteSupplierProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const profile = await prisma.supplierProfile.findFirst({
      where: { user_id: userId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Supplier profile not found" });
    }

    await prisma.supplierProfile.delete({
      where: { id: profile.id },
    });

    res.json({
      message: "Supplier profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting supplier profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};
