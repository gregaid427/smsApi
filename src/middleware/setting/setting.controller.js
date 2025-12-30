const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const pool = require("../../config/database.js");
// const logger = require("../../util/logger.js");
var createHash = require("hash-generator");
const uploadFile = require("./upload.js");
let date = new Date();
date = date.toUTCString();
// mail sender details
var transporter = nodemailer.createTransport({
  // service: "gmail",
  host: process.env.MAILING_HOST,
  port: 465,
  auth: {
    user: process.env.MAILING_USER,
    pass: process.env.MAILING_PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

function getUserByEmail(email, callBack) {
  try {
          pool.query(
    `select * from users where email = ? `,
    [email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}
catch (error) {
}
}

function getschdata(email, callBack) {
  try {
          pool.query(
    `select * from school limit 1 `,
    [email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}
catch (error) {
}
}

module.exports = {
  // createUserStaff: async (req, res) => {
  //   //await uploadFile(req, res);
  //   //console.log(res)

  //   const data = req.body;
  //   var customStaffId = hashgenerator(6);

  //   function hashgenerator(num) {
  //     return createHash(num);
  //   }

  //   const userPin = Math.floor(Math.random() * 9000 + 1000);

   
  //   date = date.toUTCString();

  //   function idGenerator() {
  //     // let month = new Date().getMonth() + 1
  //     let year = new Date().getFullYear();
  //     return year;
  //   }

  //   let partId = await idGenerator();

  //   const saltRounds = 10;

  //   let password = await bcrypt.hash(data.password, saltRounds);

  //   //check if email/username exists
  //   getUserByEmail(data.email, (err, results) => {
  //     if (results) {
  //       return res.status(200).json({
  //         success: 0,
  //         message: "Email Already Taken",
  //         data: [],
  //       });
  //     }

  //     // if not create user
  //     else {
  //       //when user is staff
  //       let sqlQuery3 = `select staff_id from staff order by id desc limit 1  `;
  //       try {
  //         pool.query(sqlQuery3, (error, result) => {
  //         console.log(error);

  //         function myresult() {
  //           let val = result[0].staff_id;
  //           console.log(val);

  //           val = val.slice(-4);
  //           val = parseInt(val) + 1;
  //           return "SF" + partId + val;
  //         }

  //         // check if db is empty start with a default student_id
  //         const staff_id = result[0] ? myresult() : "SF" + partId + "1110";

  //         let sqlQuery = `insert into staff (userId,sEmail,sGender,sLastName,sFirstName,sOtherName,contact1,contact2,address,staff_id ,definedRole,info) values
  //         ('${customStaffId}','${data.email}','${data.gender}','${data.lastName}','${data.firstName}','${data.otherName}','${data.contact1}','${data.contact2}','${data.address}','${staff_id}','${data.definedRole}','${data.info}')`;

  //         try {
  //         pool.query(sqlQuery, (error, result) => {
  //           console.log(error);

  //           /////////////////////// check if initial data insert is successful then proceed to insert general users data
  //           if (result.affectedRows == 1) {
  //             let sqlQuery1 = `insert into users (userId,email,createdAt,createdBy,pincode,role,password ) values
  //             ('${customStaffId}','${data.email}','${date}','${data.createdBy}',${userPin},'staff','${password}')`;

  //             try {
  //         pool.query(sqlQuery1, (error, result) => {
  //               if (error) {
  //                 // logger.info(
  //                 //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create new user -error`
  //                 // );
  //                 return res.status(500).json({
  //                   success: 0,
  //                   error: "internal server error -create New user",
  //                 });
  //               }

  //               if (result.affectedRows == 1) {
  //                 // logger.info(
  //                 //   `${req.method} ${req.originalUrl}, create new user successful`
  //                 // );
  //                 res
  //                   .status(500)
  //                   .json({ success: 1, Message: "User Created Successfully" });

  //                 const signedToken = jwt.sign(
  //                   { data: result.email },
  //                   process.env.JWT_KEY
  //                 );

  //                 // send mail to user email
  //                 var mailOptions = {
  //                   from: 'Yes School Support "seedo@seedogh.com"',
  //                   to: result.email,
  //                   subject: "Email Verification",
  //                   html: `<h2>Thanks for registering on our Platform</h2>
  //                     <h4>Kindly click on the link below to verify your account</h2>
        
                      
  //                         <a href=" https://optimumpay.vercel.app/admin9/${result.email}/verify/${signedToken}" >click this link to verify Email </a>`,
  //                 };
  //                 transporter.sendMail(mailOptions, function (error, info) {
  //                   const jsontoken = sign(
  //                     { result: result.userId },
  //                     process.env.JWT_KEY3
  //                   );

  //                   let logInfo;
  //                   if (data.role == "student") {
  //                     logInfo = { user: data.email, pass: data.password };
  //                   } else {
  //                     logInfo = "";
  //                   }
  //                   // if (error) {
  //                   //   console.log("mail not sent");
  //                   //   console.log(signedToken);
  //                   //   result.password = "";
  //                   //   return res.status(200).json({
  //                   //     success: 1,
  //                   //     message: "sign up  successful",
  //                   //     userPin: userPin,
  //                   //     data: logInfo,
  //                   //     access_token: jsontoken,
  //                   //     Verification_mail: "mail not sent - network Connectivity",
  //                   //   });
  //                   // } else {
  //                   //   console.log("verification mail sent");
  //                   //   return res.status(200).json({
  //                   //     success: 1,
  //                   //     message: "sign up successful",
  //                   //     data: logInfo,
  //                   //     access_token: jsontoken,
  //                   //     Verification_mail: "mail sent",
  //                   //     userPin: userPin,
  //                   //   });
  //                   // }
  //                 });
  //               }
  //             });
  //           }
  //           catch (error) {
  //           }
  //           } else
  //             res
  //               .status(500)
  //                        .json({ success: 0, error: "internal server error",message:error });

  //         });
  //       }
  //       catch (error) {
  //       }
  //       });
  //     }
  //     catch (error) {
  //     }
        
  //     }
      
      
  //   });
  // },

  createSchoolInfo: async (req, res) => {

      const data = req.body;
  

      getschdata(data.email, (err, results) => {
        if (results) {
      let sqlQuery = `update school set name=${data.name} ,address=${data.address}, contact1=${data.contact1}, contact2=${data.contact2},code=${data.code}, email=${data.email} `;
      try {
          pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create new section`
          // );
          return res
            .status(500)
                     .json({ success: 0, error: "internal server error",message:error });

        }
  
        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, create new section`);
        }
      });
    }
    catch (error) {
    }
        }
  
        // if not create user
        else {
          let sqlQuery = `insert into school (name,address,contact1,contact2,email) values  (${data.name},${data.address},${data.contact1},${data.contact2},${data.email} `;
          try {
          pool.query(sqlQuery, (error, result) => {
            if (error) {
              // logger.info(
              //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create new section`
              // );
              return res
                .status(500)
                         .json({ success: 0, error: "internal server error",message:error });

            }
      
            if (result.affectedRows == 1) {
              // logger.info(`${req.method} ${req.originalUrl}, create new section`);
            }
          });
        }
        catch (error) {
        }

        }
        

      });

  
     
    

  },

  setStudentPicture: async (req, res) => {
    await uploadFile(req, res);
     console.log(req.body)
    const data = JSON.parse(req.body.data);
    console.log(data)

    let link =
    process.env.SERVERLINK + "/" + data.filename;
    let sqlQuery = `update student set filename='${data.filename}',imagelink = '${link}'
     where userId = '${data.id}' `;

   
    try {
          pool.query(sqlQuery, (error, result) => {
    //  console.log()
      if (error) return res
      .status(500)
      .json({ success: 0, Message: "Error Uploadeding Image" });

      if (result.affectedRows == 1) {
        return res
          .status(200)
          .json({ success: 1, Message: "Student Image Uploaded Successfully" });
      }
    });
  }
  catch (error) {
  }
  },


  };
