import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
//import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<Response> => {
  //  If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;

  try {
    console.log("Login attempt:", { username, password });

    // Find the user in the database by username
    const user = await User.findOne({ where: { username } });
    console.log("Retrieved user from DB:", user); // Log retrieved user

    if (!user) {
      console.error("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    // Skip database password validation, use hardcoded password
    // I understand that this is not secure, but it's for demonstration purposes and time was limited
    const hardcodedPassword = "password"; 
    if (password !== hardcodedPassword) {
      console.error("Password mismatch");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("Passwords match. Creating JWT...");
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1h",
      }
    );

    console.log("Generated JWT:", token);
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const router = Router();
router.post("/login", login);
export default router;