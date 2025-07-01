import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/User";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getSubcategories,
  updateCategory,
} from "../controllers/CategoryController";

const categoryRouter = Router();

categoryRouter.use(authMiddleware);

categoryRouter.post("/", roleMiddleware(["SUPPLIER", "ADMIN"]), createCategory);

categoryRouter.get("/", getAllCategories);

categoryRouter.get("/:id", getCategoryById);

categoryRouter.put(
  "/:id",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  updateCategory
);

categoryRouter.delete(
  "/:id",
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  deleteCategory
);

categoryRouter.get("/:categoryId/subcategories", getSubcategories);

export default categoryRouter;
