import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/User";
import upload from "../utils/upload";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  filterProductsByBrand,
  filterProductsByCategory,
  getAllProducts,
  getProductById,
  getProductImages,
  searchProducts,
  updateProduct,
  uploadProductImages,
} from "../controllers/ProductController";

const productRouter = Router();

productRouter.use(authMiddleware);

productRouter.post("/", roleMiddleware(["SUPPLIER", "ADMIN"]), createProduct);

productRouter.get("/", getAllProducts);

productRouter.get("/:id", getProductById);

productRouter.put("/:id", roleMiddleware(["SUPPLIER", "ADMIN"]), updateProduct);

productRouter.delete(
  "/:id",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  deleteProduct
);

productRouter.get("/search", searchProducts);

productRouter.get("/category/:categoryId", filterProductsByCategory);

productRouter.get("/brand/:brandId", filterProductsByBrand);

productRouter.post(
  "/:productId/images",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  upload.array("images", 10),
  uploadProductImages
);

productRouter.get("/:productId/images", getProductImages);

productRouter.delete(
  "/images/:imageId",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  deleteProductImage
);

export default productRouter;
