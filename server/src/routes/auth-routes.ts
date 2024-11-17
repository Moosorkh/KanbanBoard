import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
//import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<Response> => {
  // TODO: If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;

  try {
    console.log("Login attempt:", { username, password });

    const user = await User.findOne({ where: { username } });
    console.log("User retrieved from DB:", user);

    if (!user) {
      console.error("User not found in DB:", username);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(
      "Comparing provided password:",
      password,
      "with stored password:",
      user.password
    );
    if (password !== user.password) {
      console.error("Password mismatch");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("Passwords match. Generating JWT...");
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.error("JWT_SECRET_KEY is not set in environment variables!");
      throw new Error("Server misconfiguration");
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
    console.log("Generated JWT:", token);

    return res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login error:", error.message, error.stack);
    } else {
      console.error("Login error:", error);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const router = Router();
router.post("/login", login);
export default router;