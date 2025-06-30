import { Router } from "express";
import {
  createUserAddress,
  getAllAddressesForUser,
  getAddressById,
  updateAddressById,
  deleteAddressById,
  setDefaultAddress,
} from "../controllers/addressController";
import authMiddleware from "../middleware/authMiddleware";

const addressRouter = Router();

addressRouter.use(authMiddleware);

addressRouter.post("/", createUserAddress);

addressRouter.get("/user/:userId", getAllAddressesForUser);

addressRouter.get("/:id", getAddressById);

addressRouter.put("/:id", updateAddressById);

addressRouter.delete("/:id", deleteAddressById);

addressRouter.put("/set-default", setDefaultAddress);

export default addressRouter;
