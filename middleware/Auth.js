const jwt = require("jsonwebtoken");

function Auth(req, res, next) {

    try {

        // GET TOKEN FROM COOKIE
        const token = req.cookies.token;

        // TOKEN NOT FOUND
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token found"
            });
        }

        // VERIFY TOKEN
        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY
        );

        // STORE USER DATA IN REQ
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = Auth;