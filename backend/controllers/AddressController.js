import prisma from "../services/prisma";
import {
  createUserAddressSchema,
  setDefaultAddressSchema,
  updateUserAddressSchema,
} from "../validators/Address";

export const createUserAddress = async (req, res) => {
  try {
    const parsed = createUserAddressSchema.parse(req.body);

    const {
      user_id,
      wilaya_id,
      commune_id,
      address_line1,
      address_line2,
      postal_code,
      landmark,
      phone,
      is_default,
      address_type,
      recipient_name,
      notes,
    } = parsed;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [wilaya, commune] = await Promise.all([
      prisma.wilaya.findUnique({ where: { id: wilaya_id } }),
      prisma.commune.findUnique({ where: { id: commune_id } }),
    ]);

    if (!wilaya || !commune) {
      return res.status(400).json({ error: "Invalid Wilaya or Commune ID" });
    }

    if (is_default === true) {
      await prisma.userAddress.updateMany({
        where: { user_id },
        data: { is_default: false },
      });
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        user: {
          connect: { id: user_id },
        },
        wilaya: {
          connect: { id: wilaya_id },
        },
        commune: {
          connect: { id: commune_id },
        },
        address_line1,
        address_line2,
        postal_code,
        landmark,
        phone,
        is_default,
        address_type,
        recipient_name,
        notes,
      },
    });

    res.status(201).json({
      message: "Address created successfully",
      address: newAddress,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating address:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllAddressesForUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const addresses = await prisma.userAddress.findMany({
      where: { user_id: userId },
      include: {
        wilaya: true,
        commune: true,
      },
    });

    if (!addresses.length) {
      return res
        .status(404)
        .json({ error: "No addresses found for this user" });
    }

    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const addressId = parseInt(req.params.id);

    const address = await prisma.userAddress.findUnique({
      where: { id: addressId },
      include: {
        wilaya: true,
        commune: true,
      },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAddressById = async (req, res) => {
  try {
    const addressId = parseInt(req.params.id);
    const parsed = updateUserAddressSchema.parse(req.body);

    const address = await prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    if (
      parsed.is_default === true &&
      parsed.is_default !== address.is_default
    ) {
      await prisma.userAddress.updateMany({
        where: { user_id: address.user_id },
        data: { is_default: false },
      });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id: addressId },
      parsed,
    });

    res.json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAddressById = async (req, res) => {
  try {
    const addressId = parseInt(req.params.id);

    const address = await prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    await prisma.userAddress.delete({
      where: { id: addressId },
    });

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId, userId } = setDefaultAddressSchema.parse(req.body);

    const address = await prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address || address.user_id !== userId) {
      return res
        .status(404)
        .json({ error: "Address not found or does not belong to the user" });
    }

    await prisma.userAddress.updateMany({
      where: { user_id: userId },
      data: { is_default: false },
    });

    const updatedAddress = await prisma.userAddress.update({
      where: { id: addressId },
      data: { is_default: true },
    });

    res.json({
      message: "Default address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error setting default address:", error);
    res.status(500).json({ error: "Server error" });
  }
};
