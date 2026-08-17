const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "No token, authorization denied"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    next(new ApiError(401, "Token is not valid"));
  }
};

// Attaches req.userId if a valid token is present, but doesn't block the
// request otherwise — used on routes usable by both guests and logged-in
// users (e.g. shortening a URL).
const optionalAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  } catch (err) {
    // invalid token on an optional route — proceed as a guest
  }
  next();
};

module.exports = { auth, optionalAuth };
