import prisma from "../services/prisma";
import {
  InventoryLogFilterSchema,
  InventoryStatusSchema,
  InventoryUpdateSchema,
} from "../validators/Inventory";
import * as zod from "zod";

export const updateInventory = async (req, res) => {
  try {
    const parsed = InventoryUpdateSchema.parse(req.body);
    const { productId, variantId, changeQuantity, reason } = parsed;

    const supplierId = req.user.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant || variant.product_id !== productId) {
        return res
          .status(400)
          .json({ error: "Invalid product-variant relationship" });
      }
    }

    let inventoryRecord = await prisma.productInventory.findFirst({
      where: {
        product_id: productId,
        variant_id: variantId || null,
        supplier_id: supplierId,
      },
    });

    if (!inventoryRecord) {
      return res.status(404).json({ error: "Inventory record not found" });
    }

    const newStock = inventoryRecord.stock_quantity + changeQuantity;
    if (newStock < 0) {
      return res.status(400).json({ error: "Cannot reduce stock below zero" });
    }

    const updatedInventory = await prisma.productInventory.update({
      where: { id: inventoryRecord.id },
      data: {
        stock_quantity: newStock,
      },
    });

    await prisma.inventoryLog.create({
      data: {
        product_id: productId,
        variant_id: variantId || null,
        supplier_id: supplierId,
        change_quantity: changeQuantity,
        reason: reason || "Manual adjustment",
      },
    });

    return res.json({
      message: "Inventory updated successfully",
      inventory: updatedInventory,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating inventory:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getInventoryStatus = async (req, res) => {
  try {
    const parsed = InventoryStatusSchema.parse(req.query);
    const userType = req.user.user_type;
    const supplierId = userType === "SUPPLIER" ? req.user.id : undefined;

    const { productId, variantId } = parsed;

    const whereClause = {
      product_id: productId,
      variant_id: variantId || null,
      ...(supplierId && { supplier_id: supplierId }),
    };

    const inventory = await prisma.productInventory.findFirst({
      where: whereClause,
    });

    if (!inventory) {
      return res.status(404).json({ error: "Inventory record not found" });
    }

    const available = inventory.stock_quantity - inventory.reserved_quantity;

    return res.json({
      productId: inventory.product_id,
      variantId: inventory.variant_id,
      stockQuantity: inventory.stock_quantity,
      reservedQuantity: inventory.reserved_quantity,
      availableQuantity: available,
      minStockLevel: inventory.min_stock_level,
      reorderPoint: inventory.reorder_point,
      lastUpdated: inventory.last_updated,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error fetching inventory status:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const trackInventoryChanges = async (req, res) => {
  try {
    const parsed = InventoryLogFilterSchema.parse(req.query);

    const {
      productId,
      variantId,
      supplierId,
      startDate,
      endDate,
      page,
      limit,
    } = parsed;

    const whereClause = {};

    if (productId) whereClause.product_id = productId;
    if (variantId) whereClause.variant_id = variantId;
    if (supplierId) whereClause.supplier_id = supplierId;

    if (startDate || endDate) {
      whereClause.created_at = {};
      if (startDate) whereClause.created_at.gte = new Date(startDate);
      if (endDate) whereClause.created_at.lte = new Date(endDate);
    }

    const logs = await prisma.inventoryLog.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        product: true,
        variant: true,
        supplier: true,
      },
    });

    if (!logs.length) {
      return res.status(404).json({ error: "No inventory logs found" });
    }

    return res.json(
      logs.map((log) => ({
        id: log.id,
        productId: log.product_id,
        variantId: log.variant_id,
        supplierId: log.supplier_id,
        changeQuantity: log.change_quantity,
        reason: log.reason,
        createdAt: log.created_at,
        product: {
          name:
            log.product.name_en || log.product.name_fr || log.product.name_ar,
          sku: log.product.sku,
        },
        variant: log.variant
          ? {
              name: log.variant.variant_name,
              value: log.variant.variant_value,
            }
          : null,
        supplier: {
          companyName: log.supplier.company_name,
        },
      }))
    );
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error tracking inventory changes:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
