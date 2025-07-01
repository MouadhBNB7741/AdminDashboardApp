import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  userRouter,
  profileRouter,
  addressRouter,
  locationRouter,
  productRouter,
} from "./Routes/exporter";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

//making the images acceptable
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Routes
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/address", addressRouter);
app.use("/location", locationRouter);
app.use("/product", productRouter);

app.listen(8081, () => {
  console.log("Mouadh in the back says Hi!");
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
