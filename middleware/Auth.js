const jwt = require("jsonwebtoken");

function Auth(req, res, next) {

  // GET TOKEN FROM COOKIES
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "No token"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    req.user = decoded; // attach user data

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid token"
    });
  }
}

module.exports = Auth;