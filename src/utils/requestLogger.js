export default (req, res, next) => {
  console.log("============================= REQUEST START ===================================");
  console.log("Time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Body:", req.body);
  console.log("Query:", req.query);
  console.log("Params:", req.params);
  console.log("============================== REQUEST END =====================================\n");
  
  next();
};
