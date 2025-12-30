const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/database.js");
// const logger = require("../../util/logger.js");
const uploadFile = require("./upload.js");


let date = new Date();
date = date.toUTCString();
let createHash = require("hash-generator");
const { query } = require("express");
function hashgenerator(num) {
  return createHash(num);
}
async function updateGuardianInfo(data) {
  const promise1 = await new Promise((resolve, reject) => {
    let sqlQuery = `UPDATE guardian SET gFirstName = '${data.gfName}', gLastName = '${data.glName}', gContact1 = '${data.contact1}', gContact2 = '${data.contact2}', gEmail = '${data.gemail}', gAddress = '${data.gAddress}', gSex = '${data.gsex}', gRelation = '${data.gRelation}' WHERE guardian.userId = '${data.id}'`;

    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          console.log("error inserting guardian info");

          return resolve(null);
        }

        console.log("guardian info inserted successfully");
        return resolve(true);
      });
    }
    catch (error) {
    }
  });
  return promise1;
}

async function register(mydata) {
  async function extractdata(mydata) {
    let data = {
      FIRST_NAME: mydata.FIRST_NAME ? mydata.FIRST_NAME : "",
      OTHER_NAMES: mydata.OTHER_NAMES ? mydata.OTHER_NAMES : "",
      LAST_NAME: mydata.LAST_NAME ? mydata.LAST_NAME : "",
      RELIGION: mydata.RELIGION ? mydata.RELIGION : "",
      GENDER: mydata.GENDER_M_F ? mydata.GENDER_M_F : "",
      ARREARS: mydata.ARREARS ? mydata.ARREARS : 0,
      SECTION: mydata.SECTION ? mydata.SECTION : 'NONE',
      SECTIONID: mydata.SECTIONID ? mydata.SECTIONID : "-",


      DATE_OF_BIRTH_DDMMYYYY: mydata.DATE_OF_BIRTH_DDMMYYYY
        ? mydata.DATE_OF_BIRTH_DDMMYYYY
        : "",
      GUARDIAN_1_FIRST_NAME: mydata.GUARDIAN_1_FIRST_NAME
        ? mydata.GUARDIAN_1_FIRST_NAME
        : "",
      GUARDIAN_1_LAST_NAME: mydata.GUARDIAN_1_LAST_NAME
        ? mydata.GUARDIAN_1_LAST_NAME
        : "",
      GUARDIAN_1_GENDER: mydata.GUARDIAN_1_GENDER_M_F
        ? mydata.GUARDIAN_1_GENDER_M_F
        : "",
      GUARDIAN_1_RELATION: mydata.GUARDIAN_1_RELATION
        ? mydata.GUARDIAN_1_RELATION
        : "",
      GUARDIAN_1_CONTACT1: mydata.GUARDIAN_1_CONTACT1
        ? mydata.GUARDIAN_1_CONTACT1
        : "",
      GUARDIAN_1_CONTACT2: mydata.GUARDIAN_1_CONTACT2
        ? mydata.GUARDIAN_1_CONTACT2
        : "",
      GUARDIAN_1_ADDRESS: mydata.GUARDIAN_1_ADDRESS
        ? mydata.GUARDIAN_1_ADDRESS
        : "",
      GUARDIAN_1_EMAIL: mydata.GUARDIAN_1_EMAIL ? mydata.GUARDIAN_1_EMAIL : "",
      GUARDIAN_2_FIRST_NAME: mydata.GUARDIAN_2_FIRST_NAME
        ? mydata.GUARDIAN_2_FIRST_NAME
        : "",
      GUARDIAN_2_LAST_NAME: mydata.GUARDIAN_2_LAST_NAME
        ? mydata.GUARDIAN_2_LAST_NAME
        : "",
      GUARDIAN_2_GENDER: mydata.GUARDIAN_2_GENDER
        ? mydata.GUARDIAN_2_GENDER
        : "",
      GUARDIAN_2_RELATION: mydata.GUARDIAN_2_RELATION
        ? mydata.GUARDIAN_2_RELATION
        : "",
      GUARDIAN_2_CONTACT1: mydata.GUARDIAN_2_CONTACT1
        ? mydata.GUARDIAN_2_CONTACT1
        : "",
      GUARDIAN_2_CONTACT2: mydata.GUARDIAN_2_CONTACT2
        ? mydata.GUARDIAN_2_CONTACT2
        : "",
      GUARDIAN_2_ADDRESS: mydata.GUARDIAN_2_ADDRESS
        ? mydata.GUARDIAN_2_ADDRESS
        : "",
      GUARDIAN_2_EMAIL: mydata.GUARDIAN_2_EMAIL ? mydata.GUARDIAN_2_EMAIL : "",
      STUDENT_PASSWORD: mydata.STUDENT_PASSWORD ? mydata.STUDENT_PASSWORD : "",
      EMAIL: mydata.EMAIL ? mydata.EMAIL : "",
      CLASS: mydata.CLASS ? mydata.CLASS : "",
      CLASSID: mydata.CLASSID ? mydata.CLASSID : "",
      GUARD1_PASSWORD: mydata.GUARD1_PASSWORD ? mydata.GUARD1_PASSWORD : "",
      GUARD2_PASSWORD: mydata.GUARD2_PASSWORD ? mydata.GUARD2_PASSWORD : "",
      GUARD1_USERNAME: mydata.GUARD1_USERNAME ? mydata.GUARD1_USERNAME : "",
      GUARD2_USERNAME: mydata.GUARD2_USERNAME ? mydata.GUARD2_USERNAME : "",
      CREATED_BY: mydata.CREATED_BY ? mydata.CREATED_BY : "",
    };
    return data;
  }

  let data = await extractdata(mydata);
  let hashedPass = await bcrypt.hash(data.STUDENT_PASSWORD, 10);
  console.log(data);
  const userPin = Math.floor(Math.random() * 9000 + 1000);

  let hashedPassGuard1 = await bcrypt.hash(data.GUARD1_PASSWORD, 10);
  const userPinGuard1 = Math.floor(Math.random() * 9000 + 1000);

  let hashedPassGuard2 = await bcrypt.hash(data.GUARD2_PASSWORD, 10);
  const userPinGuard2 = Math.floor(Math.random() * 9000 + 1000);

  async function idGenerator() {
    // let month = new Date().getMonth() + 1
    let year = new Date().getFullYear();
    return year;
  }

  let partId = await idGenerator();

  async function checkExistingStudent(callBack) {
    try {
      pool.query(
        `select student_id from student order by id desc limit 1`,

        (error, results, fields) => {
          console.log(results);

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

  checkExistingStudent((err, result) => {
    function myresult() {
      let val = result.student_id;
      val = val.slice(-4);
      val = parseInt(val) + 1;
      return "SD" + partId + val;
    }
    // check if db is empty start with a default student_id
    let student_id = result ? myresult() : "SD" + partId + "1110";
    let sdtID = student_id;
    let studUserId = createHash(6);
    function studGender(gender) {
      if (gender == '' || gender == undefined) return '-';

      if (gender == 'M' || gender == 'm' || gender == 'Male' || gender == 'male') return 'Male';

      if (gender == 'F' || gender == 'f' || gender == 'Female' || gender == 'female') return 'Female';

      if (gender != 'F' || gender != 'f' || gender != 'Male' || gender != 'male' || gender != 'Female' || gender != 'female') return '-';




    }
    let gender = studGender(data.GENDER)
    function checkarrears(val) {
      console.log(typeof (val))
      if (typeof (val) != 'number') return 0
      if (typeof (val) == 'number') return val

    }

    let studarrears = checkarrears(data.ARREARS)
    //insert into student table
    sqlQuery1 = `insert into student (userId,student_id,firstName,lastName,otherName,class,section,religion,dateofbirth,gender,accountbalance,sectionid,classid) values
        ('${studUserId}','${sdtID}','${data.FIRST_NAME}','${data.LAST_NAME}','${data.OTHER_NAMES}','${data.CLASS}','${data.SECTION}','${data.RELIGION}','${data.DATE_OF_BIRTH_DDMMYYYY}','${gender}','${studarrears}','${data.SECTIONID}','${data.CLASSID}')`;

    try {
      pool.query(sqlQuery1, (error, result) => {
        if (error) return console.log(error);
        // first create student into student table

        if (result.affectedRows == 1) {
          //   let sqlQuery = `insert into account (student_id,createdat,createdby) values
          // ('${sdtID}','${date}','${data.CREATED_BY}')`;

          //   try {
          //     pool.query(sqlQuery, (error, result) => {
          //       if (error) {
          //         console.log("student account error");
          //         console.log(error);
          //       }
          //     });
          //   }
          //   catch (error) {
          //   }
          // insert student into users table
          let sqlQuery1 = `insert into users (email,createdAt,createdBy,pincode,role,password,userId,pass) values 
              ('${data.EMAIL}','${date}','${data.CREATED_BY}',${userPin},'student','${hashedPass}', '${studUserId}', '${data.STUDENT_PASSWORD}')`;

          try {
            pool.query(sqlQuery1, (error, result) => {
              if (error) {
                console.log("student eeror error");
                return res.status(500).json({ success: 0, Message: error });
              }

              ///////////////////////////////////////////////////////

              if (data.GUARDIAN_1_FIRST_NAME != "") {
                console.log("fffffffffffffffffffffff");
                let customguardian1Id = createHash(6);
                function GuardGender(gender) {
                  if (gender == '' || gender == undefined) return '-';

                  if (gender == 'M' || gender == 'm' || gender == 'Male' || gender == 'male') return 'Male';

                  if (gender == 'F' || gender == 'f' || gender == 'Female' || gender == 'female') return 'Female';

                  if (gender != 'F' || gender != 'f' || gender != 'Male' || gender != 'male' || gender != 'Female' || gender != 'female') return '-';



                }
                let guardgender = GuardGender(data.GUARDIAN_1_GENDER)
                slqQuery4 = `insert into guardian (userId,originalemail,gEmail,gSex,gLastName,gFirstName,gContact1,gContact2,gAddress,student_id,gRelation ) values
  ('${customguardian1Id}','${data.GUARDIAN_1_EMAIL}','${data.GUARD1_USERNAME}','${guardgender}','${data.GUARDIAN_1_LAST_NAME}','${data.GUARDIAN_1_FIRST_NAME}','${data.GUARDIAN_1_CONTACT1}','${data.GUARDIAN_1_CONTACT2}','${data.GUARDIAN_1_ADDRESS}','${sdtID}','${data.GUARDIAN_1_RELATION}') `;

                try {
                  pool.query(slqQuery4, (error, result) => {
                    if (error) {
                      console.log("Guardian1 GUARDIAN error");
                      return res.status(500).json({ success: 0, Message: error });
                    }

                    let sqlQuery3 = `insert into users (userId,email,createdAt,createdBy,pincode,role,password,pass ) values
  ('${customguardian1Id}','${data.GUARD1_USERNAME}','${date}','${data.CREATED_BY}',${userPinGuard1},'parent','${hashedPassGuard1}','${data.GUARD1_PASSWORD}')`;

                    try {
                      pool.query(sqlQuery3, (error, result) => {
                        if (error) {
                          console.log(error);

                          console.log("Guardian1 USERS  error");
                          return res.status(500).json({ success: 0, Message: error });
                        }
                      });
                    }
                    catch (error) {
                    }
                  });
                }
                catch (error) {
                }
              }
              if (data.GUARDIAN_2_FIRST_NAME != "") {
                let customguardian2Id = createHash(6);
                function GuardGender(gender) {
                  if (gender == '' || gender == undefined) return '-';

                  if (gender == 'M' || gender == 'm' || gender == 'Male' || gender == 'male') return 'Male';

                  if (gender == 'F' || gender == 'f' || gender == 'Female' || gender == 'female') return 'Female';

                  if (gender != 'F' || gender != 'f' || gender != 'Male' || gender != 'male' || gender != 'Female' || gender != 'female') return '-';



                }
                let guardgender = GuardGender(data.GUARDIAN_1_GENDER)
                slqQuery4 = `insert into guardian (userId,originalemail,gEmail,gSex,gLastName,gFirstName,gContact1,gContact2,gAddress,student_id,gRelation ) values
  ('${customguardian2Id}','${data.GUARDIAN_2_EMAIL}','${data.GUARD2_USERNAME}','${guardgender}','${data.GUARDIAN_2_LAST_NAME}','${data.GUARDIAN_2_FIRST_NAME}','${data.GUARDIAN_2_CONTACT1}','${data.GUARDIAN_2_CONTACT2}','${data.GUARDIAN_2_ADDRESS}','${sdtID}','${data.GUARDIAN_2_RELATION}') `;

                try {
                  pool.query(slqQuery4, (error, result) => {
                    if (error) {
                      console.log("Guardian2 GUARDIAN error");
                      return res.status(500).json({ success: 0, Message: error });
                    }

                    let sqlQuery3 = `insert into users (userId,email,createdAt,createdBy,pincode,role,password ,pass) values
  ('${customguardian2Id}','${data.GUARD2_USERNAME}','${date}','${data.CREATED_BY}',${userPinGuard2},'parent','${hashedPassGuard2}','${data.GUARD2_PASSWORD}')`;

                    try {
                      pool.query(sqlQuery3, (error, result) => {
                        if (error) {
                          console.log("Guardian2 USERS  error");
                          return res.status(500).json({ success: 0, Message: error });
                        }
                      });
                    }
                    catch (error) {
                    }
                  });
                }
                catch (error) {
                }
              }

              //////////////////////////////////////////////////////////////////////
            });
          }
          catch (error) {
          }
        } else {
          console.log("error along line");
          return res.status(500).json({
            success: 0,
            error: "internal server error",
            message: error,
          });
        }
      });
    }
    catch (error) {
    }
  });
}

module.exports = {
  bulkAdmission: async (req, res) => {
    let datas = req.body;
    let length = datas.length;

    for (let i = 0; i < length; i++) {
      const kk = await register(datas[i]);
      if (datas.length - 1 == i) {
        let sqlQuery = `SELECT * from class where isActive='true' order by class.title`;

        try {
          pool.query(sqlQuery, (error, result) => {
            return res.status(200).json({
              success: 1,
              data: result,
              message: "Bulk Students created successfully",
            });

          });

        }
        catch (error) {
        }
      }

    }
  },
  getdetails: async (req, res) => {

    let data = req.body;
    let myArray = []

    function getresulttype(data) {
      if (data.section == null) {
        return `select student.student_id,student.firstName,student.otherName, student.lastName,student.gender,student.section, student.class,student.cartegory,student.cartegory from student where student.class = '${data.class}'`;
      }
      if (data.section == "All Sections") {
        return `select student.student_id,student.firstName,student.otherName, student.lastName,student.gender,student.section, student.class, student.cartegory,student.cartegory from student where student.class = '${data.class}'`;
      } else {
        return `select student.student_id,student.firstName,student.otherName, student.lastName,student.gender,student.section, student.cartegory,student.cartegory from student where student.class = '${data.class}'  and student.section = '${data.section}'`;
      }
    }
    const promise1 = await new Promise((resolve, reject) => {

      try {
        pool.query(getresulttype(data), async (error, resultz) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
            );
          } else {
            resolve(resultz)
          }
        });
      }
      catch (error) {
      }
    });
    let promise = promise1
    if (promise.length == 0) { }
    else {
      let arr=[]

      function update(result,myArray) {
console.log(result)
      //   let std = result[0].firstName +" "+ result[0].otherName +" "+ result[0].lastName;
      //  let g1 = result[0].gFirstName +" "+ result[0].gLastName;
      // let g2 = result[0].gFirstName +" "+ result[0].gLastName;

      //  let g1c1 = result[0].gContact1 == undefined ? '-' : result[0].gContact1
      //  let g1c2 = result[0].gContact2 == undefined ? '-' : result[0].gContact2
      //    let g2c1 = result[1].gContact1 == undefined ? '-' : result[1].gContact1
      //  let g2c2 = result[1].gContact2 == undefined ? '-' : result[1].gContact2
      
      result.length > 1 ? myArray.push({ StudentId: result[0].student_id, name: result[0].firstName +" "+ result[0].otherName +" "+ result[0].lastName, class: result[0].class, section: result[0].section, Guardianz: result[0].gFirstName ,Guardian: result[0].gLastName,  Contact1: result[0].gContact1, Contact2: result[0].gContact2, Guardian_2: result[1].gFirstName +" "+ result[1].gLastName, Contact_1: result[1].gContact1, Contact_2: result[1].gContact2, acct_bal: result[0].accountbalance }) : myArray.push({ StudentId: result[0].student_id, name: result[0].firstName +" "+ result[0].otherName +" "+ result[0].lastName, class: result[0].class, section: result[0].section, Guardianz: result[0].gFirstName, Guardian: result[0].gLastName , Contact1: result[0].gContact1, Contact2: result[0].gContact2, acct_bal: result[0].accountbalance })
        return myArray
      }

      for (const val of promise) {
        let sqlQuery = `select student.student_id,student.firstName,student.lastName,student.otherName,student.class,student.cartegory,student.section,student.amountpaid,student.accountbalance, guardian.* from student left join guardian on student.student_id = guardian.student_id  where student.student_id = '${val.student_id}'`;
      //  console.log(sqlQuery)
        const promise1 = await new Promise((resolve, reject) => {

          try {

            pool.query(sqlQuery, (error, result) => {
              if (error) {
                // logger.info(
                //   `${req.method} ${req.originalUrl}, 'server error', fetch all users`
                // );

                return res
                  .status(500)
                  .json({ success: 0, error: "internal server error", message: error });
              }
              resolve(result)

              // logger.info(
              //   `${req.method} ${req.originalUrl},'success', fetch all users`
              // );
              //  let info = result[0]
              //  console.log(result[0].gContact1 +""+ result[0].gContact2,)

            });


          } catch (error) {
          }
        });
        
         update(promise1,arr)

     ///   console.log('myArrayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')

       

      }
         res.status(200).json({ success: 1, data: arr });

    }

  },
  setstudentwaiting: (req, res) => {
    let sqlQuery = `update student set status = 'Awaiting Promotion'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows > 0) {
          res.status(200).json({ success: 1, data: result });
          console.log("students status updated");
        }
        // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
      });
    }
    catch (error) {
    }
  },
  movestudent: (req, res) => {
    let data = req.body;





    if (data.clazz == 'GRADUATED') {
      console.log('Graduated not null')


      //  let sqlQuery = `INSERT INTO graduatedstudent (userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid) SELECT userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid from student where student.class = '${data.prevclass}'`;
      let sqlQuery = `INSERT INTO graduatedstudent (userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid) SELECT userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid from student where student.student_id = '${data.id}'`;

      //  function getquery(val,val2){
      //   if(val == 'GRADUATED' && val2 == [])  return sqlQuery
      //   if(val == 'GRADUATED' && val2 != [])  return sqlQuery2

      //  }
      try {
        pool.query(sqlQuery, (error, result) => {
          console.log('query run')
          if (error) {
            console.log(error);
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          } else {
            let sqlQuery = `update student set class='Graduated',classid='0',section='Graduated' where student.student_id = '${data.id}'`
            try {
              pool.query(sqlQuery, (error, result) => {
                if (error) {
                  console.log(error);
                  // logger.info(
                  //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
                  // );
                  return res
                    .status(500)
                    .json({ success: 0, error: "internal server error", message: error });
                }


                // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
              });
            }
            catch (error) {
            }

          }

        })
      }
      catch (error) {
      }
      // return res
      //   .status(200)
      //   .json({ success: 1, message: 'Moved to Graduated' });
      return res
        .status(200)
        .json({ success: 1, message: 'Moved to Graduated' });
    }
    else {
      let sqlQuery = `update student set class='${data.clazz}',previousclass ='${data.prevclass}' , classid='${data.clazzid}',section='${data.section}' where student_id='${data.id}'`;
      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }

          if (result.affectedRows > 0) {
            res.status(200).json({ success: 1, data: result });
            console.log("student Moved Successfully");
          }
          // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
        });
      }
      catch (error) {
      }
    }
  },
  allpromote: async (req, res) => {
    console.log('all promote')

    let data = req.body;

    let myArray = req.body.value;
    console.log(data)


    if (data.nextclass == 'GRADUATED') {
      console.log('Graduated')

      const promise1 = await new Promise((resolve, reject) => {

        let sqlQuery = `select student_id from student where class ='${data.prevclass}' `
        try {
          pool.query(sqlQuery, (error, result) => {
            if (error) {
              console.log(error);
              // logger.info(
              //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
              // );
              return res
                .status(500)
                .json({ success: 0, error: "internal server error", message: error });
            } else {
              resolve(result)
            }

          })
        }
        catch (error) {
        }
      })
      let promise = promise1
      let i = 0;
      for (const element of myArray) {
        console.log(element)
        let sqlQuery = `INSERT INTO graduatedstudent (userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid) SELECT userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid from student where student.student_id = '${element}'`;
        try {
          pool.query(sqlQuery, (error, result) => {
            if (error) {
              console.log(error);
              // logger.info(
              //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
              // );
              return res
                .status(500)
                .json({ success: 0, error: "internal server error", message: error });
            } else {
              let sqlQuery = `update student set class='Graduated',classid='0',section='Graduated' where student.student_id ='${element}'`

              try {
                pool.query(sqlQuery, (error, result) => {
                  if (error) {
                    console.log(error);
                    // logger.info(
                    //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
                    // );
                    return res
                      .status(500)
                      .json({ success: 0, error: "internal server error", message: error });
                  }


                  // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
                });
              }
              catch (error) {
              }

            }

          })

        }
        catch (error) {
        }
      }
      return res
        .status(200)
        .json({ success: 1, message: 'Moved to Graduated' });


    }

    else {
      let sqlQuery = `update student set status = 'current' ,class='${data.nextclass}' where class ='${data.prevclass}'`;
      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }

          if (result.affectedRows) {
            res.status(200).json({ success: 1, data: result });
            console.log("students status updated");
          }
          // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
        });
      }
      catch (error) {
      }
    }
  },
  selectedpromote: async (req, res) => {
    let data = req.body;
    console.log('selected promote')
    console.log(data)

    let myArray = req.body.value;
    //if graduated multiple students
    if (data.nextclass == 'GRADUATED' && myArray.length == 0) {
      console.log('Graduated null')

      let sqlQuery = `INSERT INTO graduatedstudent (userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid) SELECT userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid from student where student.classid = '${data.prevclassid}'`;


      try {
        pool.query(sqlQuery, (error, result) => {
          console.log('query run')
          if (error) {
            console.log(error);
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          } else {
            let sqlQuery = `update student set class='Graduated',classid='0',section='Graduated' where  class = '${data.prevclass}'`
            try {
              pool.query(sqlQuery, (error, result) => {
                if (error) {
                  console.log(error);
                  // logger.info(
                  //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
                  // );
                  return res
                    .status(500)
                    .json({ success: 0, error: "internal server error", message: error });
                }


                // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
              });

            }
            catch (error) {
            }

          }


        })
        // return res
        //   .status(200)
        //   .json({ success: 1, message: 'Moved to Graduated' });

        return res
          .status(200)
          .json({ success: 1, message: 'Moved to Graduated' });
      }

      catch (error) {
      }


    }
    //if graduated 
    if (data.nextclass == 'GRADUATED' && myArray.length != 0) {
      console.log('Graduated not null')

      for (const element of myArray) {

        //  let sqlQuery = `INSERT INTO graduatedstudent (userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid) SELECT userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid from student where student.class = '${data.prevclass}'`;
        let sqlQuery = `INSERT INTO graduatedstudent (userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid) SELECT userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid from student where student.student_id = '${element}'`;

        //  function getquery(val,val2){
        //   if(val == 'GRADUATED' && val2 == [])  return sqlQuery
        //   if(val == 'GRADUATED' && val2 != [])  return sqlQuery2

        //  }
        try {
          pool.query(sqlQuery, (error, result) => {
            console.log('query run')
            if (error) {
              console.log(error);
              // logger.info(
              //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
              // );
              return res
                .status(500)
                .json({ success: 0, error: "internal server error", message: error });
            } else {
              let sqlQuery = `update student set class='Graduated',classid='0',section='Graduated'   where student.student_id = '${element}'`

              try {
                pool.query(sqlQuery, (error, result) => {
                  if (error) {
                    console.log(error);
                    // logger.info(
                    //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
                    // );
                    return res
                      .status(500)
                      .json({ success: 0, error: "internal server error", message: error });
                  }


                  // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
                });
              }
              catch (error) {
              }

            }

          })
        }
        catch (error) {
        }
        // return res
        //   .status(200)
        //   .json({ success: 1, message: 'Moved to Graduated' });
      }
      return res
        .status(200)
        .json({ success: 1, message: 'Moved to Graduated' });
    }
    if (data.type == 'All') {
      console.log("Promote All");

      let sqlQuery = `update student set status = 'current', previousclass ='${data.prevclass}' ,class='${data.nextclass}',classid='${data.nextclassid}' where class ='${data.prevclass}'`;
      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            console.log(error);
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }


          return res.status(200).json({
            success: 1,
            message: "updated students class successfully",
          });

          // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
        });
      }
      catch (error) {
      }

    }
    if (data.type == 'Selected') {

      console.log("Promote Selected");

      let sqlQuery = `update student set status = 'current' , previousclass ='${data.prevclass}' ,class='${data.nextclass}',classid='${data.nextclassid}' class ='${data.prevclass}'`;
      try {
        pool.query(sqlQuery, async (error, result) => {
          if (error) {
            console.log(error);
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          console.log("result.affectedRows");
          console.log(result.affectedRows);

          if (result.affectedRows) {
            if (0 == myArray.length)
              return res.status(200).json({
                success: 1,
                message: "updated students class successfully",
              });

            async function update(myArray) {
              for (const val of myArray) {
                console.log(val)
                let sqlQuery = `update student set status = 'current' ,class='${data.prevclass}' where student_id ='${val}'`;
                try {
                  pool.query(sqlQuery, (error, result) => { });
                }
                catch (error) {
                }

              }
            }

            async function main(myArray) {
              await update(myArray);
              res.status(200).json({
                success: 1,
                message: "updated students class successfully",
              });
            }
            main(myArray);



          }

          // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
        });
      }
      catch (error) {
      }








    }

  },

  getStudentByUserId: (req, res) => {
    const id = req.params.student_id;
    let sqlQuery = `select * from student where student_id = '${id}'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (!result) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, fetch user by id: no record found`
          // );
          return res
            .status(200)
            .json({ success: 1, error: "fetch user by id: no record found" });
        }
        // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getstudent: (req, res) => {
    let sqlQuery = `select * from student where isActive='true'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', fetch all student`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getStudentByUserId: (req, res) => {
    const id = req.params.student_id;
    let sqlQuery = `select * from student where student_id = '${id}'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch user by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (!result) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, fetch user by id: no record found`
          // );
          return res
            .status(200)
            .json({ success: 1, error: "fetch user by id: no record found" });
        }
        // logger.info(`${req.method} ${req.originalUrl}, fetch user by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getstudentbyClass: (req, res) => {
    const clazz = req.body.class;
    console.log(clazz);
    let sqlQuery = `select * from student where class = '${clazz}' and isActive='true' and status='current'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getstudentbyClass2: (req, res) => {
    const clazz = req.body.class;
    console.log(clazz);
    let sqlQuery = `select * from student where class = '${clazz}' `;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getstudentbyClassCustom3: (req, res) => {
    const clazz = req.body.class;

    const section = req.body.section;

    let sqlQuery = `select * from student where class = '${clazz}' and section = '${section}'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(sqlQuery)

        if (error) {
          console.log(sqlQuery)
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getstudentbyClassCustom: (req, res) => {
    const clazz = req.body.class;

    const section = req.body.section;

    let sqlQuery = `select * from student where class = '${clazz}' and section = '${section}' and isActive='true' and status='current'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getstudentcustom: (req, res) => {
    let data = req.body;

    function getresulttype(data) {
      if (data.section == null) {
        return `select student.student_id,student.firstName,student.otherName, student.lastName,student.gender,student.section, student.class,student.cartegory,student.cartegory from student where student.class = '${data.class}'`;
      }
      if (data.section == "All Sections") {
        return `select student.student_id,student.firstName,student.otherName, student.lastName,student.gender,student.section, student.class, student.cartegory,student.cartegory from student where student.class = '${data.class}'`;
      } else {
        return `select student.student_id,student.firstName,student.otherName, student.lastName,student.gender,student.section, student.cartegory,student.cartegory from student where student.class = '${data.class}'  and student.section = '${data.section}'`;
      }
    }
    try {
      pool.query(getresulttype(data), async (error, resultz) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          );
        } else {
          let result = [{ jjj: "pppppp" }, { jjj: "pppppp" }, { jjj: "pppppp" }];
          async function jsonConvert(result) {
            console.log("result");
            console.log(result);

            result.map((obj, index) => {
              obj.examScore = 0;
              obj.classWorkScore = 0;
              // obj.othersScore = 0;
            });
            return result;
          }
          let bnb = await jsonConvert(resultz);
          res.status(200).json({ success: 1, data: bnb });
          console.log(bnb);
        }
      });
    }
    catch (error) {
    }
  },
  getstudentbyClassbal: (req, res) => {
    const clazz = req.body.class;
    console.log(clazz);
    let sqlQuery = `select * from student where student.class = '${clazz}'`;
    try {
      pool.query(sqlQuery, async (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          );
        }
        console.log(result);

        const promise1 = await new Promise((resolve, reject) => {
          let sqlQuery = `select * from assignfeecartegory where class = '${clazz}'  `;
          try {
            pool.query(sqlQuery, (error, results) => {
              if (error) {
                // logger.info(
                //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
                // );
                // return res
                //   .status(500)
                //            .json({ success: 0, error: "internal server error",message:error });
              }
              console.log(results);

              resolve(results);
            });
          }
          catch (error) {
          }
        });

        let info = await promise1;
        //  console.log(info)

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );

        res.status(200).json({ success: 1, data: result, info: info });
      });
    }
    catch (error) {
    }
  },
  getstudentbyClassCustomBal: async (req, res) => {
    const clazz = req.body.class;
    const section = req.body.section;

    let sqlQuery = `select * from student where student.class = '${clazz}' and student.section = '${section}'`;
    try {
      pool.query(sqlQuery, async (error, result) => {
        if (error) {
          logger.info(
            `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          );
        }
        console.log(result);
        const promise1 = await new Promise((resolve, reject) => {
          let sqlQuery = `select * from assignfeecartegory where class = '${clazz}' `;
          try {
            pool.query(sqlQuery, (error, results) => {
              if (error) {
                console.log(
                  `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
                );

                // return res
                //   .status(500)
                //            .json({ success: 0, error: "internal server error",message:error });
              }
              resolve(results);
            });
          }
          catch (error) {
          }
        });

        let info = await promise1;
        console.log(info);

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );

        res.status(200).json({ success: 1, data: result, info: info });
      });
    }
    catch (error) {
    }
  },

  getstudentbyClassPromote: (req, res) => {
    const clazz = req.body.class;
    console.log(clazz);
    let sqlQuery = `select * from student where class = '${clazz}' and isActive='true' `;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          logger.info(
            `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getstudentbyClassCustomPromote: (req, res) => {
    const clazz = req.body.class;
    const section = req.body.section;

    let sqlQuery = `select * from student where class = '${clazz}' and section = '${section}' and isActive='true' `;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all student by class`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  // getstudentlimiteddata: (req, res) => {
  //   const id = req.params.student_id;
  //   console.log(id);
  //   let sqlQuery = `select student from student where student_id = '${id}'`;
  //   try {
  //       pool.query(sqlQuery, (error, result) => {
  //     if (error) {
  //       logger.info(
  //         `${req.method} ${req.originalUrl} ${req.error}, 'server error', fetch single student biodata`
  //       );

  //       return res
  //         .status(500)
  //                  .json({ success: 0, error: "internal server error",message:error });

  //     }

  //     logger.info(
  //       `${req.method} ${req.originalUrl},'success', fetch single student biodata`
  //     );

  //     res.status(200).json({ success: 1, data: result });
  //   });
  // },
  globalsearch: async (req, res) => {
    const data = req.body;
    console.log(data);
    let sqlQuery = `select * from student`
    const promise1 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl} ${req.error}, 'server error', fetch single student biodata`
            // );
            console.log(error)
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          resolve(result)
          // logger.info(
          //   `${req.method} ${req.originalUrl},'success', fetch single student biodata`
          // );

        });
      }
      catch (error) {
      }
    });
    let allstudent = promise1;
    let id = data.id.trim()
    let split = id.split(' ')
    let filtered = []
    console.log(split)
    for (const element of split) {
      let all = allstudent
      let filteredData = allstudent.filter(value => {
        return (
          value.student_id.toLowerCase().includes(element.toLowerCase()) ||
          value.firstName.toLowerCase().includes(element.toLowerCase()) ||
          value.lastName.toLowerCase().includes(element.toLowerCase()) ||
          value.otherName
            .toString()
            .toLowerCase()
            .includes(element.toLowerCase())
        );
      });
      all = filteredData
      filtered = all
    }


    let result1 = filtered
    return res.status(200).json({ success: 1, data: result1 });

  },
  getstudentbiodata: (req, res) => {
    const id = req.params.student_id;
    console.log(id);
    let sqlQuery = `select * from student where student_id = '${id}'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${req.error}, 'server error', fetch single student biodata`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch single student biodata`
        // );
        res.status(200).json({ success: 1, data: result });
        console.log(result);
      });
    }
    catch (error) {
    }
  },

  setStudentLogo: async (req, res) => {
    await uploadFile(req, res);
    const data = JSON.parse(req.body.data);

    let link = process.env.SERVERLINK + "/" + data.filename;
    let sqlQuery = `update student set filename='${data.filename}',imagelink = '${link}'
     where student_id = ${data.id} `;

    try {
      pool.query(sqlQuery, (error, result) => {
        //  console.log()
        if (error)
          return res
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
  updatestudent: async (req, res) => {
    // console.log(res)

    const data = req.body;

    //  let link = process.env.SERVERLINK + "/uploadsstudent/" + data.filename;
    let sqlQuery = `UPDATE student SET firstName = '${data.firstName}', lastName = '${data.lastName}', otherName = '${data.otherName}', class = '${data.classes}',cartegory = '${data.cartegory}', section = '${data.section}', religion = '${data.religion}', gender = '${data.gender}', dateofbirth = '${data.dateofbirth}' WHERE student_id = '${data.studentId}' `;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(error);
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update user data`
          // );
          return res
            .status(500)
            .json({ success: 0, Message: "internal server error" });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, update user data: no record found`
          // );
          return res
            .status(200)
            .json({ success: 0, message: "update user data: no record found" });
        }

        if (result.affectedRows == 1) {
          let data1 = data.g1
          let data2 = data.g2
          console.log(data1)
          console.log(data2)

          if (data.g1.id) updateGuardianInfo(data1);
          if (data.g2.id) updateGuardianInfo(data2);

          // logger.info(`${req.method} ${req.originalUrl}, update user data`);
          return res
            .status(200)
            .json({ success: 1, Message: "update student data success" });
        }
      });
    }
    catch (error) {
    }
  },

  deleteStudentsingle: async (req, res) => {
    const studentId = req.body.id;
    const clazz = req.body.class;
    const section = req.body.section;
    const userid = req.body.userid;


    let sqlQuery1 = `INSERT INTO deletedstudent (userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid) SELECT userId, student_id, firstName, lastName, otherName, class, cartegory, previousclass, section, religion, gender, dateofbirth, accountbalance, status, isActive, filename, imagelink, feepayable, scholarship, arrears, preference, feegeneratedate, feegenerateforsession, feegeneratecode, deposit, amountpaid from student where student.student_id = '${studentId}'`;

    const promise1 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery1, (error, result) => {
          console.log(error)
          if (error)
            return res
              .status(500)
              .json({ success: 0, Message: "Error duplicating into deleted students table" });

          resolve(result)
        });
      }
      catch (error) {
      }
    })

    let sqlQuery9 = `delete from users WHERE userId = '${userid}'`;


    const promise15 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery9, (error, result) => {
          console.log(error)
          if (error)
            return res
              .status(500)
              .json({ success: 0, Message: "Error duplicating into deleted students table" });

          resolve(result)
        });
      }
      catch (error) {
      }
    })

    let promise0 = promise15


    let promise = promise1
    let sqlQuery = `update student set class='Deleted',classid='1',section='Deleted'   where student.student_id =  '${studentId}'`;

    try {
      pool.query(sqlQuery, async (error, result) => {
        if (error) {
          console.log(error)
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete user by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete user by user id: no user record found`
          // );
          return res.status(200).json({
            success: 0,
            error: "delete user by id: no user record found",
          });
        }

        let promise = promise1
        // logger.info(`${req.method} ${req.originalUrl}, delete user pin by id`);

        let sectionz = section == "All Sections" ? "none" : section;

        let sqlQuery = `select student_id,firstName,otherName, lastName,gender, class,section from student where class = '${clazz}' and section = '${sectionz}' and isActive='true'`;
        try {
          pool.query(sqlQuery, (error, result) => {
            // logger.info(
            //   `${req.method} ${sqlQuery},'success', fetch all student by class`
            // );
            console.log(result);
            res.status(200).json({ success: 1, data: result });
          });
        }
        catch (error) {
        }

      })
    }
    catch (error) {
    }
  },

  truncateTable: (req, res) => {
    let sqlQuery = `truncate table student`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete all records`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, delete all records`);
          return res.status(200).json({
            success: 1,
            message: "delete all record success",
          });
        }
      });
    }
    catch (error) {
    }
  },


  //////////////////////////////
  deleteSingleStudentCart: (req, res) => {
    const data = req.body;
    console.log(data);
    let sqlQuery = `delete from studentscartegory where id = '${data.id}'`;
    // let sqlQuery = `delete from fee`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete fee Cartegory by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          console.log(
            `${req.method} ${req.originalUrl}, delete fee Cartegory by  id: no fee Cartegory record found`
          );
          return res.status(200).json({
            success: 0,
            error: "delete fee Cartegory by id: no fee cartegory record found",
            message: error,
          });
        }
        if (result.affectedRows == 1) {
          let sqlQuery = `select * from studentscartegory `;
          try {
            pool.query(sqlQuery, (error, result) => {
              res.status(200).json({ success: 1, data: result });
            });
          }
          catch (error) {
          }
        }

      });
    }
    catch (error) {
    }
  },

  createstudentCartegory: (req, res) => {
    const data = req.body;
    let hash = hashgenerator(7);
    console.log(data);
    let sqlQuery = `insert into studentscartegory (title,cartid,createdby,createdat,description) values
  ('${data.name}','${hash}','${data.createdby}','${date}','${data.description}')`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method}  ${error.sqlMessage}, ${req.originalUrl}, 'server error', create  fee cartegory`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(
          `${req.method} ${req.originalUrl},'success', create  fee cartegory`
        );
        if (result.affectedRows == 1) {
          console.log(`${req.method} ${req.originalUrl},Success create new fee`);

          console.log(
            `${req.method} ${req.originalUrl},Success create new column field`
          );
          let sqlQuery = `select * from studentscartegory `;
          try {
            pool.query(sqlQuery, (error, result) => {
              res.status(200).json({ success: 1, data: result });
            });
          }
          catch (error) {
          }
        }
      });
    }
    catch (error) {
    }
  },
  graduatesingledel: (req, res) => {
    const data = req.body;
    console.log(data);
    let sqlQuery = `delete from graduatedstudent where student_id = '${data.id}'`;
    // let sqlQuery = `delete from fee`;
    console.log(sqlQuery)
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete fee Cartegory by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }


        let sqlQuery = `select * from graduatedstudent `;
        try {
          pool.query(sqlQuery, (error, result) => {
            res.status(200).json({ success: 1, data: result });
          });
        }
        catch (error) {
        }
      });
    }
    catch (error) {
    }
  },


  deldeletedstudent: (req, res) => {
    const data = req.body;

    let sqlQuery = `delete from deletedstudent WHERE student_id = '${data.id}'`;
    try {
      pool.query(sqlQuery, async (error, result) => {
        if (error) {
          console.log(error)
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete user by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete user by user id: no user record found`
          // );
          return res.status(200).json({
            success: 0,
            error: "delete user by id: no user record found",
          });
        }

        // logger.info(`${req.method} ${req.originalUrl}, delete user pin by id`);


        let sqlQuery = `select * from deletedstudent`;
        try {
          pool.query(sqlQuery, (error, result) => {
            // logger.info(
            //   `${req.method} ${sqlQuery},'success', fetch all student by class`
            // );
            console.log(result);
            res.status(200).json({ success: 1, data: result });
          });
        }
        catch (error) {
        }

      })
    }
    catch (error) {
    }
  },
  delalldeletedstudent: (req, res) => {
    let sqlQuery = `truncate deletedstudent`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl}, 'server error', fetch all graduatedstudents`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${req.method} ${req.originalUrl},'success', fetch all graduatedstudents`);

        res.status(200).json({ success: 1, data: [] });
      });
    }
    catch (error) {
    }
  },
  delgraduated: (req, res) => {
    let sqlQuery = `truncate graduatedstudent`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl}, 'server error', fetch all graduatedstudents`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${req.method} ${req.originalUrl},'success', fetch all graduatedstudents`);

        res.status(200).json({ success: 1, data: [] });
      });
    }
    catch (error) {
    }
  },

  getdeletedstudent: (req, res) => {
    let sqlQuery = `select * from deletedstudent`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl}, 'server error', fetch all graduatedstudents`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${req.method} ${req.originalUrl},'success', fetch all graduatedstudents`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getgraduated: (req, res) => {
    let sqlQuery = `select * from graduatedstudent`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl}, 'server error', fetch all graduatedstudents`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${req.method} ${req.originalUrl},'success', fetch all graduatedstudents`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getCart: (req, res) => {
    let sqlQuery = `select * from studentscartegory`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${req.method} ${req.originalUrl},'success', fetch all fee`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  updatefeecart: async (req, res) => {
    const data = req.body;
    console.log(data)
    let sqlQuery1 = `update assignfeecartegory set scartegory ='${data.name}' where scartegory ='${data.formertitle}'`;
    let sqlQuery2 = `update assignfeerecord set cartegory ='${data.name}' where cartegory ='${data.formertitle}'`;
    let sqlQuery3 = `update deletedstudent set cartegory ='${data.name}' where cartegory ='${data.formertitle}'`;
    let sqlQuery4 = `update graduatedstudent set cartegory ='${data.name}' where cartegory ='${data.formertitle}'`;
    let sqlQuery5 = `update student set cartegory ='${data.name}' where cartegory ='${data.formertitle}'`;


    const promise1 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery1, (error, result) => {
          if (error) {

          }
          console.log('class cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p1 = promise1

    const promise2 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery2, (error, result) => {
          if (error) {

          }
          console.log('attendance cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p2 = promise2

    const promise3 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery3, (error, result) => {
          if (error) {

          }
          console.log('assignfeecartegory cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p3 = promise3


    const promise4 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery4, (error, result) => {
          if (error) {

          }
          console.log('assignfeerecord cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p4 = promise4

    const promise5 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery5, (error, result) => {
          if (error) {

          }
          console.log('deketedstudent cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p5 = promise5

    let sqlQuery = `update studentscartegory set title ='${data.name}',description='${data.description}',CreatedBy='${data.createdby}',createdat='${date}' where id = ${data.id}`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update fee data`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          console.log(
            `${req.method} ${req.originalUrl}, update fee data: no record found`
          );
          return res.status(200).json({
            success: 0,
            error: "update fee data: no record found",
          });
        }

        if (result.affectedRows == 1) {
          let sqlQuery = `select * from studentscartegory`;
          try {
            pool.query(sqlQuery, (error, result) => {
              res.status(200).json({ success: 1, data: result });
            });
          }
          catch (error) {
          }
        }
      });
    }
    catch (error) {
    }
  },
};

// thygracenaturalClinic$7
