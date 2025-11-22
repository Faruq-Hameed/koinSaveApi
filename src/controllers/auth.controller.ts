import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, passcode } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ msg: "Email already exists" });
      return;
    }

    const hashed = await bcrypt.hash(passcode, 10);

    const user = await User.create({
      email,
      firstName,
      lastName,
      passcode: hashed,
      balance: 0,
    });
     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });

    delete user.passcode
    res.json({ msg: "Signup successful", user,token });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, passcode } = req.body;
    console.log({email, passcode})

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ msg: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(passcode, user.passcode);
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });
    delete user.passcode

    res.json({ msg: "Login success", user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ msg: "Invalid credentials" });
      return;
    }
    delete user.passcode

    res.json({ msg: "User found", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};