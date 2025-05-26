const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const authRoute = require("./routes/authRoute.js")
const postRoute = require("./routes/postRoute.js");
const globalMiddleware = require("./middlewares/globalMiddleware.js");

const app = express();

app.use(globalMiddleware);

app.use("/auth", authRoute);
app.use("/", postRoute);

const PORT = 3000;
app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
