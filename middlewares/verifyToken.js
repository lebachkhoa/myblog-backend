
const jwt = require("jsonwebtoken");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

function verifyToken(req, res, next) {
    const accessToken = req.cookies.access_token;

    if(!accessToken) {
        return res.status(400).json({error: "No access token provided"});
    }

    try {
        const decoded = jwt.verify(accessToken,JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({error: "Invalid or expired access token"})
    }
}

module.exports = verifyToken;