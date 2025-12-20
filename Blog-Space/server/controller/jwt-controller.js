import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../model/token.js";

dotenv.config();

// ---------------- AUTH MIDDLEWARE -----------------
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ loggedIn: false, msg: "Access token missing" });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ loggedIn: false, msg: "Invalid access token" });
        }

        req.user = user;
        next();
    });
};


// ---------------- REFRESH TOKEN API -----------------
export const createNewToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ ok: false });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

        const newAccessToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 15 * 60 * 1000
        });

        return res.json({ ok: true });
    } catch (err) {
        return res.status(403).json({ ok: false });
    }
};

