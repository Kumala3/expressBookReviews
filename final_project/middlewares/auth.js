const jwt = require("jsonwebtoken");

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.session.authorization
        ? req.session.authorization["accessToken"]
        : null;

    if (!token) {
        return res.status(403).json({ message: "User not logged in" });
    }

    jwt.verify(token, process.env.SECRET_JW_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        }
        req.user = decoded; // Attach user to request object
        next(); // Pass control to the next handler
    });
}

module.exports.verifyToken = verifyToken;
