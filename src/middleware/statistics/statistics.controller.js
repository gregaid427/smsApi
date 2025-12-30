const pool = require("../../config/database.js");
// const logger = require("../../util/logger.js");

module.exports = {
  getAllStat1: (req, res) => {
    let sqlQuery1 = `select count(student.student_id) as noStudent from student where  isActive ='true'`;

    try {
      pool.query(sqlQuery1, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', result1 `
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });

        }
        return res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getAllStat2: (req, res) => {
    let sqlQuery2 = `select count(users.userId) as noStaff from users where isActive ='true' and role='staff'`;

    try {
      pool.query(sqlQuery2, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', result1 `
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });

        }
        return res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getAllStat3: (req, res) => {
    let sqlQuery3 = `select count(id) as noclass from class where isActive ='true'`;

    try {
      pool.query(sqlQuery3, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', result1 `
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });

        }
        return res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getAllStat4: (req, res) => {
    let sqlQuery4 = `select count(id) as nosubject from subject where isactive ='true'`;
    try {
      pool.query(sqlQuery4, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', result1 `
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });

        }
        return res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getAllStat5: (req, res) => {
    let sqlQuery5 = `select extract(MONTH from date) as month,sum(amount) as total_value from expense where YEAR(date) = YEAR(CURDATE()) group by month; `;

    try {
      pool.query(sqlQuery5, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', result1 `
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });

        }
        console.log(result)
        return res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getAllStat6: (req, res) => {
    let sqlQuery5 = `select count(userId) as noParent from guardian `;

    try {
      pool.query(sqlQuery5, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', result1 `
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });

        }
        return res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getAllStat7: (req, res) => {
    let sqlQuery5 = `SELECT class,count(student_id) as count from student  group by student.class;  `;

    try {
      pool.query(sqlQuery5, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, 'server error', result1 `
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });

        }
        return res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  AppUpdate: async (req, res) => {

    const promise5 = await new Promise((resolve, reject) => {

      let sqlQuery5 = `select * from school;  `;
      try {
        pool.query(sqlQuery5, (error, result) => {
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl}, 'server error', result1 `
            // );
            resolve(null)
          }
          resolve(result)

        });

      }
      catch (error) {
      }


    });
   
    let val = promise5[0]
  
    let bb = promise5[0] == undefined ? 0 :  promise5[0]
    let vv = bb.name  && bb.address && bb.contact1 && bb.email 
    let nn = bb.logolink
    const promise6 = await new Promise((resolve, reject) => {

      let sqlQuery5 = `select * from studentscartegory limit 1;  `;
      try {
        pool.query(sqlQuery5, (error, result) => {
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl}, 'server error', result1 `
            // );
            resolve(null)
          }
          resolve(result)

        });

      }
      catch (error) {
      }


    });
  
    const promise7 = await new Promise((resolve, reject) => {

      let sqlQuery5 = `select * from session where active = 'true';  `;
      try {
        pool.query(sqlQuery5, (error, result) => {
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl}, 'server error', result1 `
            // );
            resolve(null)
          }
          resolve(result)

        });

      }
      catch (error) {
      }


    });
    
    return res.status(200).json({ success: 1, logoimg: nn == null ? 0 : 1,school: vv == null ? 0 : 1,session: promise7.length , stdcart : promise6.length  });

  },
};
