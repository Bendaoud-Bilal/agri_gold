import { User } from "../sequelize/relation.js";
import { Router } from "express";
import { hashPassword, comparePassword } from "../utils/helper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
dotenv.config();
const router = Router();
router.post("/users/register", async (request, response) => {
    try {
        const user = request.body;
        user.password = hashPassword(user.password);
        const newuser = await User.create(user);
        if (!newuser) {
            return response.status(400).json({ error: "User creation failed" });
        }
        response.json({ message: "User created " });
    } catch (error) {
        response.status(400).json({ error: error.errors[0].message });// Adjusted to provide more specific error message
    }
});
export default router;