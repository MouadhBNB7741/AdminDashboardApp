import { Router } from "express";
import {
  createCustomerProfile,
  getCustomerProfileByUserId,
  updateCustomerProfileByUserId,
  deleteCustomerProfileByUserId,
  createSupplierProfile,
  getSupplierProfileByUserId,
  updateSupplierProfileByUserId,
  deleteSupplierProfileByUserId,
} from "../controllers/profileController";
import { authMiddleware } from "../middlewares/User";

const profileRouter = Router();

// Customer
profileRouter.post("/customer", authMiddleware, createCustomerProfile);
profileRouter.get(
  "/customer/:userId",
  authMiddleware,
  getCustomerProfileByUserId
);
profileRouter.put(
  "/customer/:userId",
  authMiddleware,
  updateCustomerProfileByUserId
);
profileRouter.delete(
  "/customer/:userId",
  authMiddleware,
  deleteCustomerProfileByUserId
);

// Supplier
profileRouter.post("/supplier", authMiddleware, createSupplierProfile);
profileRouter.get(
  "/supplier/:userId",
  authMiddleware,
  getSupplierProfileByUserId
);
profileRouter.put(
  "/supplier/:userId",
  authMiddleware,
  updateSupplierProfileByUserId
);
profileRouter.delete(
  "/supplier/:userId",
  authMiddleware,
  deleteSupplierProfileByUserId
);

export default profileRouter;
