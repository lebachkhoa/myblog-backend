const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const authRoute = require("./routes/authRoute.js")
const postRoute = require("./routes/postRoute.js");
const globalMiddleware = require("./middlewares/globalMiddleware.js");

const app = express();

app.use(globalMiddleware);

app.use("/auth", authRoute);
app.use("/posts", postRoute);

const PORT = process.env.BLOG_APP_LISTEN_PORT;
const HOST = process.env.BLOG_APP_LISTEN_HOST;
app.listen(PORT, HOST, () => {
    console.log(`Server is running at ${HOST}:${PORT}`);
});
