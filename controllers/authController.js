const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const authControllers = {
    // Register
    registerUser: async (req, res) => {
        try {
            const { username, password } = req.body;

            // kiem tra input
            if (!username || !password) {
                return res.status(400).json({ error: "Missing fields" });
            }

            // kiem tra user da ton tai hay chua
            const user = await userModel.getUserByUsername(username);
            if (user) {
                return res.status(400).json({ error: "Usename already exists" });
            }

            // them moi user
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);
            await userModel.createUser({ username: username, password: hashedPass });
            res.status(200).json({ message: "User created successfully" });

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Login
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;

            // kiem tra input
            if (!username || !password) {
                return res.status(400).json({ error: "Missing Fields" });
            }

            // kiem tra user da ton tai hay chua
            const user = await userModel.getUserByUsername(username);

            if (!user) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const imatch = await bcrypt.compare(password, user.password);
            if (!imatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            // tao access token
            const accessToken = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
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
                { id: user.id, username: user.username, role: user.role },
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
            console.log("Error", err);
            res.status(500).json(err);
        }
    },

    // refresh token
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(400).json({ error: "No refresh token provided" });
        }

        try {
            const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            const newAccessToken = jwt.sign(
                { id: decoded.id, username: decoded.username, role: decoded.role },
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
            return res.status(400).json({ error: "Invalid or expired refresh token" })
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