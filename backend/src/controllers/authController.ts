import { User } from "../models/User";
import type { AuthRequest } from "../middleware/auth";
import type { NextFunction, Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try{
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return;
        }

        res.status(200).json(user);
    }
    catch (error) {
        res.status(500);
        next(error);
    }
}

export async function authCallBack(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId : clerkUserId } = getAuth(req);

        if (!clerkUserId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        let user = await User.findOne({ clerkId: clerkUserId });

        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkUserId);

            user = await User.create({
                clerkId: clerkUserId,
                name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                avatar: clerkUser.imageUrl,
            });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500);
        next(error);
    }
}