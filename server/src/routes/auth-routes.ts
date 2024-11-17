import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<Response> => {
  // TODO: If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;
  
  try {
    console.log(`Login attempt for username: ${username}`);
    
    const user = await User.findOne({ 
      where: { username },
      raw: false // Make sure we get a model instance
    });
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', {
      id: user.id,
      username: user.username,
      hasPassword: !!user.password
    });

    if (!user.password) {
      console.log('No password stored for user');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // First try the instance method
    try {
      const isValid = await user.verifyPassword(password);
      if (isValid) {
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: '1h' }
        );
        return res.json({ token });
      }
    } catch (verifyError) {
      console.error('Error during password verification:', verifyError);
      // Continue to fallback verification
    }

    // Fallback direct bcrypt compare
    try {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: '1h' }
        );
        return res.json({ token });
      }
    } catch (bcryptError) {
      console.error('Error during bcrypt compare:', bcryptError);
    }

    return res.status(401).json({ message: 'Invalid password' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const router = Router();
router.post('/login', login);

export default router;