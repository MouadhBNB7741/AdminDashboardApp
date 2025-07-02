import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/User";
import {
  getInventoryStatus,
  trackInventoryChanges,
  updateInventory,
} from "../controllers/InventoryController";

const inventoryRouter = Router();

inventoryRouter.post(
  "/update",
  authMiddleware,
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  updateInventory
);

inventoryRouter.get(
  "/status",
  authMiddleware,
  validateRequest(InventoryStatusSchema),
  getInventoryStatus
);

inventoryRouter.get(
  "/logs",
  authMiddleware,
  roleMiddleware(["SUPPLIER", "ADMIN"]),
  trackInventoryChanges
);

export default inventoryRouter;
