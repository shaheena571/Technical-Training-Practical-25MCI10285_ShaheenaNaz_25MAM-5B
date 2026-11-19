const jwt = require("jsonwebtoken");

// This runs before any protected route.
// It checks if the request has a valid token.
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  // token comes like:  "Bearer eyJhbGciOi..."
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, please login" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // save the user id so routes can use it
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
}

module.exports = protect;
