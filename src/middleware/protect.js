import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not logged in", 401);
  }

  try {
    const decoded = verifyToken(token); // <-- verifyToken from jwt.js
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    throw new AppError("Session expired or invalid token", 401);
  }
};
