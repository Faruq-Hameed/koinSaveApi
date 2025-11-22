import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import trxRoutes from "./routes/transaction.routes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log("request made", req.path);
  next();
});
app.use("/auths", authRoutes);
app.use("/transactions", trxRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
