import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<Response> => {
  // TODO: If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;
  try {

    console.log("Login attempt for username:", username);

    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("JWT_SECRET_KEY exists:", !!process.env.JWT_SECRET_KEY);
    // let's add the expiration for 10 seconds
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '10s' });

    console.log("Token generated:", !!token);

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
