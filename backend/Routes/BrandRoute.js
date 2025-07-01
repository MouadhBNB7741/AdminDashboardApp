import { Router } from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  createProductVariant,
  getAllVariantsByProductId,
  getVariantById,
  updateProductVariant,
  deleteProductVariant,
  setProductPricing,
  getPricingByProductOrVariant,
  updateProductPricing,
} from "../controllers/BrandController";
import { authMiddleware, roleMiddleware } from "../middlewares/User";

const brandRouter = Router();

brandRouter.use(authMiddleware);

brandRouter.post("/brands", roleMiddleware(["SUPPLIER", "ADMIN"]), createBrand);

brandRouter.get("/brands", getAllBrands);

brandRouter.get("/brands/:id", getBrandById);

brandRouter.put(
  "/brands/:id",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  updateBrand
);

brandRouter.delete(
  "/brands/:id",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  deleteBrand
);

brandRouter.post(
  "/products/:productId/variants",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  createProductVariant
);

brandRouter.get("/products/:productId/variants", getAllVariantsByProductId);

brandRouter.get("/products/variants/:variantId", getVariantById);

brandRouter.put(
  "/products/variants/:variantId",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  updateProductVariant
);

brandRouter.delete(
  "/products/variants/:variantId",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  deleteProductVariant
);

brandRouter.post(
  "/pricing",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  setProductPricing
);

brandRouter.get("/pricing/product/:productId", getPricingByProductOrVariant);
brandRouter.get("/pricing/variant/:variantId", getPricingByProductOrVariant);

brandRouter.put(
  "/pricing/:pricingId",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  updateProductPricing
);

export default brandRouter;
