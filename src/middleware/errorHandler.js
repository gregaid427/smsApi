// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("======================== ERROR START ===========================");
  console.error("Time:", new Date().toISOString());
  console.error("Method:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("Body:", req.body);
  console.error("Query:", req.query);
  console.error("Params:", req.params);
  console.error("StatusCode:", err.statusCode || 500);
  console.error("Message:", err.message);
 // console.error("Stack:", err.stack);
  console.error("========================= ERROR END =============================");

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: 0,
    status: err.status || "error",
    message: err.isOperational ? err.message : "Internal server error",
  });
};

export default errorHandler;
