// src/routes/index.js

// const express = require('express');
// const auth = require('../middlewares/auth');

// const router = express.Router();

// router.get('/profile', auth, (req, res) => {
//   res.json({
//     message: 'Protected data',
//     user: req.user
//   });
// });

// module.exports = router;


// src/controllers/authController.js

// const bcrypt = require('bcrypt');
// const { signToken } = require('../utils/jwt');
// const AppError = require('../utils/AppError');

// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   // Replace with DB lookup
//   if (email !== 'admin@test.com') {
//     return next(new AppError('Invalid credentials', 401));
//   }

//   const isMatch = await bcrypt.compare(password, '$2b$10$fakehash');

//   if (!isMatch) {
//     return next(new AppError('Invalid credentials', 401));
//   }

//   const token = signToken({ email });

//   res.json({ token });
// };




// src/middlewares/auth.js

// const jwt = require('jsonwebtoken');
// const AppError = require('../utils/AppError');

// module.exports = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return next(new AppError('Unauthorized', 401));
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     next(new AppError('Invalid or expired token', 401));
//   }
// };
