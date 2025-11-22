import { Request, Response } from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";

export const addMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    user.balance += Number(amount);
    await user.save();

    await Transaction.create({
      userId,
      type: "credit",
      amount,
      purpose: "Wallet Funding",
      receiverEmail: user.email,
    });

    {
      res.json({ msg: "Wallet funded", balance: user.balance });
      return;
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export const sendMoney = async (req: Request, res: Response) => {
  try {
    const { receiverEmail, purpose, amount } = req.body;
    const senderId = req.user?.id;

    const sender = await User.findById(senderId);
    if (!sender) {
      res.status(404).json({ msg: "Sender not found" });
      return;
    }

    if (sender.balance < amount) {
      res.status(400).json({ msg: "Insufficient balance" });
      return;
    }

    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      res.status(404).json({ msg: "Receiver not found" });
      return;
    }

    // Deduct from sender
    sender.balance -= Number(amount);
    await sender.save();

    // Credit receiver
    receiver.balance += Number(amount);
    await receiver.save();

    await Transaction.create({
      userId: senderId,
      type: "debit",
      amount,
      purpose,
      senderEmail: sender.email,
      receiverEmail,
    });

    await Transaction.create({
      userId: receiver._id,
      type: "credit",
      amount,
      purpose,
      senderEmail: sender.email,
      receiverEmail,
    });

    res.json({ msg: "Money sent successfully" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const tx = await Transaction.find({ userId }).sort({ createdAt: -1 });
  res.json(tx);
};

export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tx = await Transaction.findById(id);
  if (!tx) {
    res.status(404).json({ msg: "Not found" });
    return;
  }
  res.json(tx);
};
