import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
  addMoney,
  sendMoney,
  getAllTransactions,
  getTransactionById
} from "../controllers/transaction.controller";

const router = Router();

router.post("/add", auth, addMoney);
router.post("/send", auth, sendMoney);
router.get("/", auth, getAllTransactions);
router.get("/:id", auth, getTransactionById);

export default router;
