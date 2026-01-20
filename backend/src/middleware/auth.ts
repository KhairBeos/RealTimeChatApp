import type { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { User } from '../models/User.js';
import { requireAuth } from '@clerk/express';

export type AuthRequest = Request & { userId?: string };

export const protectRoute = [
    requireAuth(),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userId: clerkUserId } = getAuth(req);
            if (!clerkUserId) {
                return res.status(401).json({ message: 'Unauthorized - Invalid token' });
            }
            const user = await User.findOne({ clerkUserId });
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized - User not found' });
            }
            req.userId = user._id.toString();
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
];