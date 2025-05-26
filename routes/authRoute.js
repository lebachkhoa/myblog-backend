const authControllers = require("../controllers/authController");

const authRouter = require("express").Router();

authRouter.post("/register", authControllers.registerUser);
authRouter.post("/login", authControllers.loginUser);
authRouter.post("/refresh", authControllers.refreshToken);       
authRouter.post("/logout", authControllers.logoutUser);

module.exports = authRouter;