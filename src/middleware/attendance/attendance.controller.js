const pool = require("../../config/database.js");
// const logger = require("../../util/logger.js");
let date = new Date();
date = date.toUTCString();
module.exports = {
  createsession: async (req, res) => {
    const data = req.body;

    // if(data.active == true){
    let sqlQuery1 = `update session set active ='false'`;
    let sqlQuery2 = `select count(id) from session'`;

    let query = data.active == true ? sqlQuery1 : sqlQuery2;

   try {
        pool.query(query, (error, result) => {
      // }

      let sqlQuery = `insert into session (sessionname,createdat,createdby,active,startmonth) values
           ('${data.sessionname}','${date}','${data.createdby}','${data.active}','${data.startmonth}')`;
     try {
        pool.query(sqlQuery, (error, result) => {
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
          let sqlQuery = `select * from session`;
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

  UpdateStatus: (req, res) => {
    let value = req.body;
    console.log(value);
    let sqlQuery = `update attendance set status = '${value.status}' where entityid = '${value.id}' and groupecode = '${value.code}'`;
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

      let sqlQuery = `select attendance.*,student.firstName,student.otherName, student.lastName from attendance left join student on attendance.entityid = student.student_id where attendance.groupecode = '${value.code}'`;
     try {
        pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', fetch all session`
          // );

          return res
            .status(500)
            .json({
              success: 0,
              error: "internal server error",
              message: error,
            });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all session`
        // );

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
  gettodayrecord: (req, res) => {
  
    let date = new Date();
    date = date.toLocaleDateString("en-CA");
    let sqlQuery = `Select * from attendance where datetaken = '${date}'  group by groupecode order by classid `;
    console.log(sqlQuery)
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
  getdetail: (req, res) => {
    let value = req.body.code;
    let sqlQuery = `select attendance.*,student.firstName,student.otherName, student.lastName from attendance left join student on attendance.entityid = student.student_id where attendance.groupecode = '${value}'`;
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

  sessionrecords: (req, res) => {
    let value = req.body;
    section = value.section;
    let sqlQuery =
      section == "All Sections"
        ? `select  attendance.* from attendance where session = '${value.session}' and classid = '${value.class}'  group by groupecode`
        : `select  attendance.* from attendance where session = '${value.session}' and classid = '${value.class}' and section = '${value.section}' group by groupecode`;
    console.log(sqlQuery);
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
  getdaterecords: (req, res) => {
    let value = req.body;
    section = value.section;
console.log(value)
    let sqlQuery =
      section == "All Sections"
        ? `select  attendance.* from attendance where datetaken = '${value.date}' and classid = '${value.class}'  group by groupecode`
        : `select  attendance.* from attendance where datetaken = '${value.date}' and classid = '${value.class}' and section = '${section}' group by groupecode`;
   try {
        pool.query(sqlQuery, (error, result) => {
      console.log(sqlQuery)
      if (error) {
        console.log(error)
        // logger.info(
        //   `${req.method} ${req.originalUrl}, 'server error', fetch all session`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });
      }
      console.log(result)

      // logger.info(
      //   `${req.method} ${req.originalUrl},'success', fetch all session`
      // );

      res.status(200).json({ success: 1, data: result });
    });
  }
  catch (error) {
  }
  },
  updatesession: (req, res) => {
    const data = req.body;

    let sqlQuery = `update session set sessionname ='${data.sessionname}',createdat='${date}',createdby='${data.createdby}' where id = ${data.id}`;

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
        let sqlQuery = `select * from session`;
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

  createattendance: (req, res) => {
    let data = req.body;
    console.log(data);
    let total = data.allentitiesid;
    let absent = data.absentid;
    let code = data.groupecode;

    async function insertattendance(total, data, absent, code) {
      console.log(data);
      const promise1 = await new Promise((resolve, reject) => {
        let sqlQuery = absent.includes(total)
          ? `INSERT INTO attendance(groupecode, entityid,classid, datetaken, createdat, createdby,status, session,section) VALUES
      ('${code}','${total}','${data.class}','${data.datetaken}','${date}','${data.createdby}','Present','${data.session}','${data.section}')`
          : `INSERT INTO attendance(groupecode, entityid,classid, datetaken, createdat, createdby,status, session,section) VALUES
      ('${code}','${total}','${data.class}','${data.datetaken}','${date}','${data.createdby}','Absent','${data.session}','${data.section}')`;

       try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            console.log(error);
            resolve(false);
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }

          if (result) {
            resolve(true);
          }
        });
      }
      catch (error) {
      }
      });
      
      return promise1;
    }

    async function forEachAsync(total, data, absent, code) {
      for (const element of total) {
        console.log(element);
        let kk = insertattendance(element, data, absent, code);
        console.log(kk);
      }
    }

    async function main(total, data, absent, code) {
      await forEachAsync(total, data, absent, code);
      console.log("Array.forEach() has finished running.");

      res.status(200).json({
        success: 1,
        message: "Attendace created successfully",
      });
    }
    main(total, data, absent, code);
  },

  updatesessionStatus: (req, res) => {
    let data = req.body;
    let sqlQuery = `update session set active ='false'`;

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
        let sqlQuery = `update session set active ='true' , startmonth='${data.startmonth}' where sessionname = '${data.session}'`;
       try {
        pool.query(sqlQuery, (error, result) => {
          let sqlQuery = `select * from session`;
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
        
      }
      
    });
  }
  catch (error) {
  }
    
  },

  deleteAllAttendance: (req, res) => {
    const id = req.body;
    // let sqlQuery = `delete from session where userId = ${id.session_id}`;
    let sqlQuery = `delete from attendance`;

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
    const id = req.params.id;
    // let sqlQuery = `delete from session where userId = ${id.session_id}`;
    let sqlQuery = `delete from session where id='${id}'`;

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
        let sqlQuery = `select * from session`;
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
