const pool = require("../../config/database.js");
// const logger = require("../../util/logger.js");
let date = new Date();
date = date.toUTCString();
var createHash = require("hash-generator");
const nodemailer = require("nodemailer");
const moment = require('moment')
const fs = require('fs')
const mysqldump = require('mysqldump')



// Example using Gmail (replace with your service and credentials)
const transporter = nodemailer.createTransport({
  service: process.env.MAILING_HOST, // or your preferred service (e.g., 'smtp', 'sendgrid')
  auth: {
    user: 'gregoryd428@gmail.com', // Your email address
    pass: 'glorycloud',    // Your app password (or access token)
  },
});




module.exports = {
  createsession: async (req, res) => {
    const data = req.body;
    console.log("new called");
    let code = "session_" + createHash(9);
    // if(data.active == true){



    let sqlQuery1 = `update session set active ='false'`;
    let sqlQuery2 = `select count(id) from session'`;

    let query = data.active == true ? sqlQuery1 : sqlQuery2;

    try {
      pool.query(query, (error, result) => {
        // }

        let sqlQuery4 = `insert into session (sessionname,sessionaccountid,createdat,sessioncode,createdby,active,startmonth,activesessionname) values
           ('${data.sessionname}','${code}','${date}','${code}','${data.createdby}','${data.active}','${data.startmonth}','${data.sessionname}')`;

        let sqlQuery5 = `insert into session (sessionname,sessionaccountid,createdat,sessioncode,createdby,active,startmonth,activesessionname) values
           ('${data.sessionname}','${code}','${date}','${code}','${data.createdby}','${data.active}','${data.startmonth}','${data.currentsession}')`;

        let query1 = data.active == true ? sqlQuery4 : sqlQuery5;

        try {
          pool.query(query1, (error, result) => {
            if (error) {
              // logger.info(
              //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create new session`
              // );
              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            }

            if (result.affectedRows == 1) {
              let sqlQuery1 = `CREATE TABLE ${code}  (
       student_id varchar(40) DEFAULT NULL,
       amountpaid varchar(10) DEFAULT '0',
       firstName varchar(50) DEFAULT NULL,
       lastName varchar(50) DEFAULT NULL,
       otherName varchar(50) DEFAULT NULL,
       class varchar(50) DEFAULT NULL,
       arrears varchar(20) DEFAULT NULL,
       session varchar(50) DEFAULT NULL,
       activeaccountid varchar(20) DEFAULT '0',
       feepayable varchar(10) DEFAULT '0',
       preference varchar(80) DEFAULT '0',
       scholarship varchar(10) DEFAULT '0',
       accountbalance varchar(10) DEFAULT '0',
       date varchar(50) DEFAULT NULL,
       createdby varchar(10) DEFAULT '0'
       )`;
              try {
                pool.query(sqlQuery1, async (error, result) => {
                  // res.status(200).json({ success: 1, data: result });
                  //set active finance account
                  //update activeaccount session id
                  let sqlQuery = `update session set activeaccountid =  '${code}',activesessionname = '${data.sessionname}'`;
                  const promise2 = await new Promise((resolve, reject) => {

                    try {
                      pool.query(sqlQuery, (error, result) => {
                        if (error) {
                          console.log(error)
                          console.log(
                            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
                          );
                          return res
                            .status(500)
                            .json({ success: 0, error: "internal server error", message: error });
                        }

                        if (!result) {
                          console.log(
                            `${req.method} ${req.originalUrl}, fetch fee by id: no record found`
                          );

                        }
                        resolve(result)
                      });
                    }
                    catch (error) {
                    }
                  });
                  let val1 = await promise2


                });
              }
              catch (error) {
              }

              let sqlQuery = `select * from session order by id desc limit 50`;
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
      });
    }
    catch (error) {
    }
  },

  getsessionById: (req, res) => {
    const id = parseInt(req.params.session_id);
    let sqlQuery = `select * from session where id = ${id}`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch session by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (!result) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, fetch session by id: no record found`
          // );
          return res
            .status(200)
            .json({ success: 1, error: "fetch session by id: no record found" });
        }
        // logger.info(`${req.method} ${req.originalUrl}, fetch session by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getAllsession: (req, res) => {
    let sqlQuery = `select * from session order by id desc limit 50`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', fetch all session`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all session`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getActivesession: (req, res) => {
    let sqlQuery = `select sessionname,activeaccountid,sessioncode  from session where active = 'true'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', fetch all session`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all session`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  backup: async (req, res) => {
    const data = req.body;
    console.log(data)
    async function backup(fileName) {
      console.log(fileName)
      const wstream = fs.createWriteStream(`./backup/${fileName}`)
      console.log('---------------------')
      let vv = await mysqldump({
        connection: {
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
        },
        dumpToFile: `./backup/${fileName}`,
      });

      return true
    }

    const fileName = `${moment().format('MMMM_D_YYYY_HH-mm-A')}.sql`
    if (data.mode == 'Instant') {

      //send mail with sql file
      const mailOptions = {
        from: process.env.MAILING_USER, // Your email address
        to: data.email, // Recipient's email address
        subject: `YesSchool SMS Data Backup : ${date}`,
        text: 'Kindly find atached for SQL file', // Plain text version of the email
        html: '<h1>Email with Attachment</h1><p>This email contains an attachment.</p>', // HTML version of the email
        attachments: [
          {
            filename: fileName,    // Name of the attachment
            path: `./backup/${fileName}`, // Path to the file
            // Or, for a buffer:
            // content: Buffer.from('hello world', 'utf8'), // Content as a buffer
            // Or, for a stream:
            // content: fs.createReadStream('/path/to/your/file.txt'), // Content as a stream
          },
        ],
      };
      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.error('Error sending email:', error);
      //   } else {
      //     console.log('Email sent:', info.response);
      //   }
      // });

      //insert db file info to table
      let backups = await backup(fileName)
      console.log(backups)
      let link = process.env.SERVERLINK + "/" + fileName;
      if (backups == true) {
        let sqlQuery4 = `insert into backup (file,datetaken,mode,takenby,link) values
        ('${fileName}','${date}','Manual','${data.createdby}','${link}')`;

        try {
          pool.query(sqlQuery4, (error, result) => {
            if (error) {
              console.log(error)
              return res
                .status(500)
                .json({ success: 0, error: "internal server error", message: error });
            }

            else {
              let sqlQuery = `select * from backup order by id desc`;

              try {
                pool.query(sqlQuery, (error, result) => {
                  if (error) {
                    // logger.info(
                    //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
                    // );
                    return res
                      .status(500)
                      .json({ success: 0, error: "internal server error", message: error });
                  }


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


      }
      else {

        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

    }


  },
  updatebackup: async (req, res) => {
    const data = req.body;
    console.log(data)


    if (data.mode == 'Manual') {
      let sqlQuery = `update school set backupmode = 'Manual',backupemail='${data.email}'`;

      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            console.log(error)
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }


          res.status(200).json({ success: 1, data: result });
        });


      }
      catch (error) {
      }
    }
    if (data.mode == 'Auto' && data.duration == 'Monthly') {
      let sqlQuery = `update school set backupmode = 'Auto',duration = 'Monthly',backupemail='${data.email}'`;

      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            console.log(error)
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }


          res.status(200).json({ success: 1, data: result });
        });


      }
      catch (error) {
      }
    }
    if (data.mode == 'Auto' && data.duration == 'Weekly') {
      let sqlQuery = `update school set backupmode = 'Auto',duration = 'Weekly',backupemail='${data.email}'`;

      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            console.log(error)
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }


          res.status(200).json({ success: 1, data: result });
        });


      }
      catch (error) {
      }
    }

  },
  getbackupfile: async (req, res) => {
    let sqlQuery1 = `select backupmode,duration,backupemail from school `;
    const promise2 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery1, (error, result) => {
          if (error) {
            console.log(error)
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }


          res.status(200).json({ success: 1, data: result });
        });


      }
      catch (error) {
      }

    });



    let sqlQuery = `select * from backup order by id desc`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(error)
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }


        res.status(200).json({ success: 1, data: result, result: promise2 });
      });


    }
    catch (error) {
    }

  },
  backupdelete: async (req, res) => {

    const directoryPath = './backup';


    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        // Handle error, e.g., directory not found
        console.error('Error reading directory:', err);
        return;
      }

      files.forEach(file => {
        const filePath = `${directoryPath}/${file}`;
        fs.stat(filePath, (err, stats) => {
          if (err) {
            // Handle error, e.g., file not found
            console.error('Error getting file stats:', err);
            return;
          }

          if (stats.isFile()) {
            fs.unlink(filePath, err => {
              if (err) {
                console.error('Error deleting file:', err);
              } else {
                console.log(`Deleted file: ${filePath}`);
              }
            });
          } else if (stats.isDirectory()) {
            fs.rm(filePath, { recursive: true, force: true }, err => {
              if (err) {
                console.error('Error deleting directory:', err);
              } else {
                console.log(`Deleted directory: ${filePath}`);
              }
            });
          }
        });
      });



    });




    let sqlQuery1 = `truncate table backup`;
    const promise2 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery1, (error, result) => {
          if (error) {
            console.log(error)
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }

          return res.status(200).json({ success: 1, data: [] });

        });


      }
      catch (error) {
      }

    });







  },
  getbackup: async (req, res) => {
    let sqlQuery1 = `select backupmode,duration,backupemail from school `;
    const promise2 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery1, (error, result) => {
          if (error) {
            console.log(error)
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }


          resolve(result)
        });


      }
      catch (error) {
      }

    });



    let sqlQuery = `select * from backup order by id desc`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(error)
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }


        res.status(200).json({ success: 1, data: result, res: promise2 });
      });


    }
    catch (error) {
    }

  },
  updatesession: async (req, res) => {
    const data = req.body;

    console.log(data)
    let sqlQuery1 = `update accountclosure set oldsession ='${data.session}' where oldsession ='${data.prevclass}' `;
    let sqlQuery2 = `update attendance set session ='${data.session}' where session ='${data.prevclass}'`;
    let sqlQuery3 = `update examgroup set session ='${data.session}' where session ='${data.prevclass}'`;
    let sqlQuery4 = `update examresult set session ='${data.session}' where session ='${data.prevclass}'`;
    let sqlQuery5 = `update examresultcode set session ='${data.session}' where session ='${data.prevclass}'`;
    let sqlQuery6 = `update feedetails set session ='${data.session}' where session ='${data.prevclass}'`;
    let sqlQuery7 = `update feegeneraterecord set session ='${data.session}' where session ='${data.prevclass}'`;
    let sqlQuery8 = `update feepaymentrecords set session ='${data.session}' where session ='${data.prevclass}'`;
    let sqlQuery9 = `update sessionaccountrecords set session ='${data.session}' where session ='${data.prevclass}'`;


    let sqlQuery10 = `update accountclosure set newsession ='${data.session}' where newsession ='${data.prevclass}' `;

    console.log(sqlQuery1)
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

    const promise6 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery6, (error, result) => {
          if (error) {

          }
          console.log('examresultcode cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p6 = promise6


    const promise7 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery7, (error, result) => {
          if (error) {

          }
          console.log('feepayrecord cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p7 = promise7



    const promise8 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery8, (error, result) => {
          if (error) {

          }
          console.log('gradstudent cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p8 = promise8



    const promise9 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery9, (error, result) => {
          if (error) {

          }
          console.log('student cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p9 = promise9

    const promise10 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery10, (error, result) => {
          if (error) {

          }
          console.log('student cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p10 = promise10

    let sqlQuery = `update session set sessionname ='${data.session}',createdat='${date}',createdby='${data.createdby}' where id = ${data.id}`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, update session data: no record found`
          // );
          return res
            .status(200)
            .json({ success: 0, error: "update session data: no record found" });
        }

        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, update session data`);
          let sqlQuery = `select * from session order by id desc limit 50`;
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

  updatesessionStatus: (req, res) => {
    let data = req.body;
    let sqlQuery = `update session set active ='false'`;
    console.log(data)
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update session data`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows) {
          // logger.info(`${req.method} ${req.originalUrl}, update session data`);
          try {
            let sqlQuery = `update session set active ='true' , startmonth='${data.startmonth}' where sessionname = '${data.session}'`;

            pool.query(sqlQuery, async (error, result) => {

              const promise2 = await new Promise((resolve, reject) => {

                pool.query(sqlQuery, (error, result) => {
                  try {

                    let sqlQuery = `update student set status ='Pending'`;
                    try {
                      pool.query(sqlQuery, (error, result) => {
                        console.log(error)
                      });
                    }
                    catch (error) {
                    }
                    let sqlQuery1 = `select * from session order by id desc`;

                    pool.query(sqlQuery1, (error, result) => {
                      res.status(200).json({ success: 1, data: result });
                    });
                  }
                  catch (error) {
                  }
                });

              })

              let cc = promise2


            });
          }
          catch (error) {
          }
        }
      }
      )

    }
    catch (error) {
    }
  },

  deleteAllsession: (req, res) => {
    const id = req.body;
    // let sqlQuery = `delete from session where userId = ${id.session_id}`;
    let sqlQuery = `delete from session`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete session by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete session by  id: no session record found`
          // );
          return res.status(200).json({
            success: 0,
            error: "delete session by id: no session record found",
          });
        }
        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, delete session  by id`);
          return res.status(200).json({
            success: 1,
            message: "session deleted successfully",
          });
        }
      });
    }
    catch (error) {
    }
  },
  deleteSinglesession: (req, res) => {
    const data = req.body;
    console.log(data);
    // let sqlQuery = `delete from session where userId = ${id.session_id}`;
    let sqlQuery = `delete from session where id='${data.id}'`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete session by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete session by  id: no session record found`
          // );
          return res.status(200).json({
            success: 0,
            error: "delete session by id: no session record found",
          });
        }
        if (result.affectedRows == 1) {
          console.log('session deleted')
          let sqlQuery1 = `drop table ${data.code}`;
          try {
            pool.query(sqlQuery1, (error, result) => {
              if (error) console.log(error.sqlMessage);
              //  res.status(200).json({ success: 1, data: result });
              console.log('table dropped')

            });
          }
          catch (error) {
          }

          // logger.info(`${req.method} ${req.originalUrl}, delete session  by id`);
          let sqlQuery = `select * from session order by id desc limit 50`;
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
