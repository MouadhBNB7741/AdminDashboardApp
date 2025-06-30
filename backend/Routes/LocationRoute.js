import { Router } from "express";
import {
  getAllWilayas,
  getWilayaById,
  createWilaya,
  updateWilaya,
  deleteWilaya,
  getAllCommunes,
  getCommuneById,
  createCommune,
  updateCommune,
  deleteCommune,
  getCommunesByWilayaId,
} from "../controllers/LocationController";
import { authMiddleware, roleMiddleware } from "../middlewares/User";

const locationRouter = Router();

// Only admins can create, update, or delete wilayas & communes
const adminOnly = roleMiddleware(["ADMIN"]);

// All location routes are authenticated
locationRouter.use(authMiddleware);

// Wilaya Routes
locationRouter.get("/wilayas", getAllWilayas);
locationRouter.get("/wilayas/:id", getWilayaById);

// Admin-only routes
locationRouter.post("/wilayas", adminOnly, createWilaya);
locationRouter.put("/wilayas/:id", adminOnly, updateWilaya);
locationRouter.delete("/wilayas/:id", adminOnly, deleteWilaya);

// Commune Routes
locationRouter.get("/communes", getAllCommunes);
locationRouter.get("/communes/:id", getCommuneById);

// Get communes by wilaya ID
locationRouter.get("/wilayas/:wilayaId/communes", getCommunesByWilayaId);

// Admin-only routes
locationRouter.post("/communes", adminOnly, createCommune);
locationRouter.put("/communes/:id", adminOnly, updateCommune);
locationRouter.delete("/communes/:id", adminOnly, deleteCommune);

export default locationRouter;
