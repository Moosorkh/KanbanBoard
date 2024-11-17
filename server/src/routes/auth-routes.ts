import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<Response> => {
  // TODO: If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;

  try {
    console.log("Login attempt:", { username, password });

    const user = await User.findOne({ where: { username } });
    console.log("Found user:", user?.toJSON());

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Simple password check
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY || "secret_key",
      { expiresIn: "1h" }
    );

    console.log("Login successful for user:", username);
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const router = Router();
router.post("/login", login);

export default router;