import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import { signToken, verifyToken } from "../../utils/jwt.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/* ================================
   SIGNUP
================================= */
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const [existing] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  if (existing.length > 0) throw new AppError("User already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 12);

  const [result] = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  const token = signToken({ id: result.insertId, email });

  res.status(201).json({
    success: 1,
    token,
    data: { id: result.insertId, name, email },
  });
};

/* ================================
   SIGNIN
================================= */
export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new AppError("Email and password required", 400);

  const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  if (!rows.length) throw new AppError("Invalid credentials", 401);

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new AppError("Invalid credentials", 401);

  const token = signToken({ id: user.id, email });

  // Log sign-in
  await pool.query(
    `INSERT INTO userLogs (userId, action, ipAddress, userAgent)
     VALUES (?, 'signin', ?, ?)`,
    [user.id, req.ip, req.headers["user-agent"] || "unknown"]
  );

  res.status(200).json({ success: 1, token, data: { id: user.id, name: user.name, email } });
};

/* ================================
   LOGOUT
================================= */
export const signout = async (req, res) => {
  const userId = req.user?.id;

  if (userId) {
    await pool.query(
      `INSERT INTO userLogs (userId, action, ipAddress, userAgent)
       VALUES (?, 'signout', ?, ?)`,
      [userId, req.ip, req.headers["user-agent"] || "unknown"]
    );
  }

  res.status(200).json({ success: 1, message: "Logged out successfully" });
};

/* ================================
   REQUEST PASSWORD RESET
================================= */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is required", 400);

  const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  if (!rows.length) throw new AppError("User not found", 404);

  const user = rows[0];
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await pool.query(
    "UPDATE users SET passwordResetToken=?, passwordResetExpires=? WHERE id=?",
    [hashedToken, expires, user.id]
  );

  // Send resetToken via email in production. For now, return in response
  res.status(200).json({
    success: 1,
    message: "Password reset token generated",
    resetToken,
  });
};

/* ================================
   RESET PASSWORD
================================= */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) throw new AppError("Token and new password required", 400);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE passwordResetToken=? AND passwordResetExpires > NOW()",
    [hashedToken]
  );
  if (!rows.length) throw new AppError("Token invalid or expired", 400);

  const user = rows[0];
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await pool.query(
    "UPDATE users SET password=?, passwordResetToken=NULL, passwordResetExpires=NULL WHERE id=?",
    [hashedPassword, user.id]
  );

  const jwt = signToken({ id: user.id, email: user.email });

  res.status(200).json({ success: 1, message: "Password reset successful", token: jwt });
};

/* ================================
   PROTECT ROUTE
================================= */
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new AppError("Not logged in", 401);

  try {
    const decoded = verifyToken(token); // Use verifyToken import
    req.user = decoded;
    next();
  } catch {
    throw new AppError("Session expired or invalid token", 401);
  }
};
