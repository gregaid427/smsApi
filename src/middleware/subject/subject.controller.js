const pool = require("../../config/database.js");
// const logger = require("../../util/logger.js");
var createHash = require("hash-generator");

let date = new Date();
date = date.toUTCString();
function hashgenerator(num) {
  return createHash(num);
}
function checkSubjectExist(data, callBack) {
  try {
          pool.query(
    `select * from subject where subjectname = '${data.subjectName}' and type = '${data.type}' `,

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
  createsubject: async (req, res) => {
    const data = req.body;

    checkSubjectExist(data, (err, results) => {
      if (results) {
        console.log("Create new Subject  Exists");
        return res.status(200).json({
          success: 0,
          data: null,
          message: "Subject Name Already Exists",
        });
      } else {
        let code = hashgenerator(5);
        let sqlQuery = `insert into subject (subjectname,createdat,createdby,type,subjectcode) values
           ('${data.subjectName.toUpperCase()}','${date}','${data.createdBy}','${data.type}','${code}')`;
        try {
          pool.query(sqlQuery, (error, result) => {
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create new subject`
            // );
            return res
              .status(500)
              .json({
                success: 0,
                error: "internal server error",
                message: error,
              });
          }

          if (result.affectedRows == 1) {
            // logger.info(`${req.method} ${req.originalUrl}, create new  subject`);

            let sqlQuery = `select * from subject`;
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
        
        
      }
   
      
    });
  },

  getsubjectById: (req, res) => {
    const id = parseInt(req.params.subject_id);
    let sqlQuery = `select * from subject where subject_id = ${id}`;
    try {
          pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch subject by id`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });
      }

      if (!result) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, fetch subject by id: no record found`
        // );
        return res
          .status(200)
          .json({ success: 1, error: "fetch subject by id: no record found" });
      }
      // logger.info(`${req.method} ${req.originalUrl}, fetch subject by id`);
      res.status(200).json({ success: 1, data: result });
    });
  }
  catch (error) {
  }
  },

  getAllSubject: (req, res) => {
    let sqlQuery = `select * from subject`;
    try {
          pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, 'server error', fetch all subject`
        // );

        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });
      }

      // logger.info(
      //   `${req.method} ${req.originalUrl},'success', fetch all subject`
      // );

      res.status(200).json({ success: 1, data: result });
    });
  }
  catch (error) {
  }
  },

  updateSubject: async (req, res) => {
    const data = req.body;
    console.log(data);


        let sqlQuery2 = `update examresult set subject ='${data.subjectname}' where subject ='${data.formersubject}'`;
    let sqlQuery3 = `update examresultcode set subject ='${data.subjectname}' where subject ='${data.formersubject}'`;

 const promise1 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery2, (error, result) => {
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

    const promise3 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery3, (error, result) => {
          if (error) {

          }
          console.log('attendance cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p2 = promise3

    let sqlQuery = `update subject set subjectname ='${data.subjectname}',createdat='${date}',createdby='${data.createdby}' , type='${data.type}' where id = ${data.id}`;

    try {
          pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update subject data`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });
      }

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, update subject data: no record found`
        // );
        return res
          .status(200)
          .json({ success: 0, error: "update subject data: no record found" });
      }

      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, update subject data`);
        let sqlQuery = `select * from subject`;
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

  deleteSingleSubject: (req, res) => {
    const id = req.params.subjectId;
    let sqlQuery = `delete from subject where id = ${id}`;

    try {
          pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete subject by id`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });
      }

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, delete subject by  id: no subject record found`
        // );
        return res.status(200).json({
          success: 0,
          error: "delete subject by id: no subject record found",
        });
      }
      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, delete subject  by id`);
        let sqlQuery = `select * from subject `;
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

  deleteAllSubject: (req, res) => {
    const id = req.body;
    // let sqlQuery = `delete from subject where userId = ${id.subject_id}`;
    let sqlQuery = `delete from subject`;

    try {
          pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete subject by id`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });
      }

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, delete subject by  id: no subject record found`
        // );
        return res.status(200).json({
          success: 0,
          error: "delete subject by id: no subject record found",
        });
      }
      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, delete subject  by id`);
        let sqlQuery = `select * from subject `;
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
