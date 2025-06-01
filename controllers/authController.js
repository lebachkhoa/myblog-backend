const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const logger = require("../utils/log4js");
const { error } = require("console");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const authControllers = {
    // Register
    registerUser: async (req, res) => {
        try {
            const { email, username, password } = req.body;

            // kiem tra input
            if (!email || !username || !password) {
                return res.status(400).json({ error: "Missing fields" });
            }

            // Dùng Promise.all để kiểm tra song song
            const [userByEmail, userByUsername] = await Promise.all([
                userModel.getUserByEmail(email),
                userModel.getUserByUsername(username)
            ]);
            if (userByEmail) {
                return res.status(409).json({ error: "Email already exists" });
            }
            if (userByUsername) {
                return res.status(409).json({ error: "Username already exists" });
            }

            // kiem tra email da ton tai hay chua
            // const userByEmail = await userModel.getUserByEmail(email);
            // if (userByEmail) {
            //     return res.status(409).json({ error: "Email already exists" });
            // }

            // kiem tra username da ton tai hay chua
            // const userByUsername = await userModel.getUserByUsername(username);
            // if (userByUsername) {
            //     return res.status(409).json({ error: "Username already exists" });
            // }

            // them moi user
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);
            await userModel.createUser({ email: email, username: username, password: hashedPass });
            res.status(200).json({ message: "User created successfully" });

        } catch (err) {
            // Race condition error
            if (err.code === "23505") {
                return res.status(409).json({ error: "Email or Username already exists" });
            }
            res.status(500).json("Internal server error");
        }
    },

    // Login
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            // kiem tra input
            if (!email || !password) {
                return res.status(400).json({ error: "Missing Fields" });
            }

            // kiem tra user da ton tai hay chua
            const user = await userModel.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const imatch = await bcrypt.compare(password, user.password);
            if (!imatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // account actived check
            if (!user.actived) {
                return res.status(403).json({ error: "Account is not actived" });
            }

            // tao access token
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, username: user.username, role: user.role },
                JWT_ACCESS_SECRET,
                { expiresIn: "1h" }
            );

            // gui access token bang cookie
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",      // chong tan cong bang CSRF (cross-site request forgery)
                maxAge: 60 * 60 * 1000      // 1h
            });

            // tao refresh token
            const refreshToken = jwt.sign(
                { id: user.id, email: user.email, username: user.username, role: user.role },
                JWT_REFRESH_SECRET,
                { expiresIn: "7d" }
            );

            // gui refresh token
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000     // 7 days
            });

            res.status(200).json({ message: "Login successful" });

        } catch (err) {

            res.status(500).json({ error: "Internal server error" });
        }
    },

    // refresh token
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ error: "No refresh token provided" });
        }

        try {
            const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            const newAccessToken = jwt.sign(
                { id: decoded.id, email: decoded.email, username: decoded.username, role: decoded.role },
                JWT_ACCESS_SECRET,
                { expiresIn: "1h" }
            );

            res.cookie("access_token", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000          // 1h
            });

            res.status(200).json({ message: "Access token refreshed" });

        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired refresh token" })
        }
    },

    // logout
    logoutUser: (req, res) => {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
        res.status(200).json({ message: "Logout successfully" });
    }
}

module.exports = authControllers;