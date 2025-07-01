import prisma from "../services/prisma";
import {
  createWilayaSchema,
  createCommuneSchema,
  updateCommuneSchema,
  updateWilayaSchema,
} from "../validators/Location";
import * as zod from "zod";

export const getAllWilayas = async (req, res) => {
  try {
    const wilayas = await prisma.wilaya.findMany({
      include: {
        Commune: true,
      },
    });

    return res.json(wilayas);
  } catch (error) {
    console.error("Error fetching wilayas:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getWilayaById = async (req, res) => {
  try {
    const wilayaId = parseInt(req.params.id);

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: wilayaId },
      include: {
        Commune: true,
      },
    });

    if (!wilaya) {
      return res.status(404).json({ error: "Wilaya not found" });
    }

    return res.json(wilaya);
  } catch (error) {
    console.error("Error fetching wilaya:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createWilaya = async (req, res) => {
  try {
    const parsed = createWilayaSchema.parse(req.body);

    const wilaya = await prisma.wilaya.create({
      parsed,
    });

    return res.status(201).json({
      message: "Wilaya created successfully",
      wilaya,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating wilaya:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateWilaya = async (req, res) => {
  try {
    const wilayaId = parseInt(req.params.id);
    const parsed = updateWilayaSchema.parse(req.body);

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: wilayaId },
    });

    if (!wilaya) {
      return res.status(404).json({ error: "Wilaya not found" });
    }

    const updatedWilaya = await prisma.wilaya.update({
      where: { id: wilayaId },
      parsed,
    });

    return res.json({
      message: "Wilaya updated successfully",
      wilaya: updatedWilaya,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating wilaya:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteWilaya = async (req, res) => {
  try {
    const wilayaId = parseInt(req.params.id);

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: wilayaId },
    });

    if (!wilaya) {
      return res.status(404).json({ error: "Wilaya not found" });
    }

    await prisma.commune.deleteMany({
      where: { wilaya_id: wilayaId },
    });

    await prisma.wilaya.delete({
      where: { id: wilayaId },
    });

    return res.json({ message: "Wilaya deleted successfully" });
  } catch (error) {
    console.error("Error deleting wilaya:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllCommunes = async (req, res) => {
  try {
    const communes = await prisma.commune.findMany({
      include: {
        wilaya: true,
      },
    });

    return res.json(communes);
  } catch (error) {
    console.error("Error fetching communes:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getCommuneById = async (req, res) => {
  try {
    const communeId = parseInt(req.params.id);

    const commune = await prisma.commune.findUnique({
      where: { id: communeId },
      include: {
        wilaya: true,
      },
    });

    if (!commune) {
      return res.status(404).json({ error: "Commune not found" });
    }

    return res.json(commune);
  } catch (error) {
    console.error("Error fetching commune:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createCommune = async (req, res) => {
  try {
    const parsed = createCommuneSchema.parse(req.body);

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: parsed.wilaya_id },
    });

    if (!wilaya) {
      return res.status(404).json({ error: "Wilaya not found" });
    }

    const commune = await prisma.commune.create({
      parsed,
    });

    return res.status(201).json({
      message: "Commune created successfully",
      commune,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating commune:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateCommune = async (req, res) => {
  try {
    const communeId = parseInt(req.params.id);
    const parsed = updateCommuneSchema.parse(req.body);

    const commune = await prisma.commune.findUnique({
      where: { id: communeId },
    });

    if (!commune) {
      return res.status(404).json({ error: "Commune not found" });
    }

    if (parsed.wilaya_id && parsed.wilaya_id !== commune.wilaya_id) {
      const wilaya = await prisma.wilaya.findUnique({
        where: { id: parsed.wilaya_id },
      });

      if (!wilaya) {
        return res.status(404).json({ error: "New Wilaya not found" });
      }
    }

    const updatedCommune = await prisma.commune.update({
      where: { id: communeId },
      parsed,
    });

    return res.json({
      message: "Commune updated successfully",
      commune: updatedCommune,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating commune:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteCommune = async (req, res) => {
  try {
    const communeId = parseInt(req.params.id);

    const commune = await prisma.commune.findUnique({
      where: { id: communeId },
    });

    if (!commune) {
      return res.status(404).json({ error: "Commune not found" });
    }

    await prisma.commune.delete({
      where: { id: communeId },
    });

    return res.json({ message: "Commune deleted successfully" });
  } catch (error) {
    console.error("Error deleting commune:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getCommunesByWilayaId = async (req, res) => {
  try {
    const wilayaId = parseInt(req.params.wilayaId);

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: wilayaId },
    });

    if (!wilaya) {
      return res.status(404).json({ error: "Wilaya not found" });
    }

    const communes = await prisma.commune.findMany({
      where: { wilaya_id: wilayaId },
    });

    return res.json(communes);
  } catch (error) {
    console.error("Error fetching communes by wilaya:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
