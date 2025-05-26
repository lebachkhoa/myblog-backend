const sanitize = require("sanitize-html");

function sanitizeMiddleware(req, res, next) {
    if (req.body) {
        for (let key in req.body) {
            if (typeof (req.body[key]) === "string") {
                req.body[key] = sanitize(req.body[key]);
            }
        }
    }
    next();
}

module.exports = sanitizeMiddleware;