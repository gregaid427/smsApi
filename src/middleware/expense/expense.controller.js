const pool = require("../../config/database.js");
const logger = require("../../util/logger.js");
const uploadFile = require("./upload.js");

let date = new Date();
date = date.toUTCString();
module.exports = {
  createExpense: async (req, res) => {
    await uploadFile(req, res);
    console.log(req);
    const data = JSON.parse(req.body.data);
    let date = new Date();
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    // date = date.toUTCString();


    let link = process.env.SERVERLINK + "/" + data.filename;

    let sqlQuery = `insert into expense (name,date,expensehead,createdby,invoice,description,amount,filename,link,createdat) values
           ('${data.name}','${data.date}','${data.expensehead}','${data.createdby}','${data.invoice}','${data.description}','${data.amount}','${data.filename}','${link}','${date}')`;
    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create new expense`
        // );
        console.log(error)
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, `);
        let sqlQuery = `select * from expense`;
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
  createExpenseHead: async (req, res) => {
    const data = req.body;


    let sqlQuery = `insert into expensehead (expensehead,createdat,createdby,notes) values
           ('${data.expensehead}','${date}','${data.createdby}','${data.notes}')`;
    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create new expenseHead`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, `);
        let sqlQuery = `select * from expensehead`;
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

  getExpenseById: (req, res) => {
    const id = parseInt(req.params.expense_id);
    let sqlQuery = `select * from expense where expense_id = ${id}`;
    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch expense by id`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      if (!result) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, fetch expense by id: no record found`
        // );
        return res.status(200).json({ success: 1, message: "Success" });
      }
      // logger.info(`${req.method} ${req.originalUrl}, fetch expense by id`);
      res.status(200).json({ success: 1, data: result });
    });
  }
  catch (error) {
  }
  },

  getcustomexpense: (req, res) => {
    const data = req.body;
    let date = data.date;
    console.log(date)
    function getparams(date) {
      if (date == "Today") {
        return `select * from expense where createdat = CURDATE()`;
      }
      if (date == "This Month") {
        return `select * from expense where MONTH(createdat)=MONTH(now())
        and YEAR(createdat)=YEAR(now())`;
      }
      if (date == "Last Month") {
        return `select * from expense where  month(createdat) = month(NOW() - INTERVAL 1 MONTH)`;
      }
      if (date == "Last Six Month") {
        return `select * from expense where createdat >= date_sub(now(),interval 6 month)`;
      }
      if (date == "This Year") {
        return `select * from expense where YEAR(createdat) = YEAR(CURDATE())`;
      }
      if (date == "Last year") {
        return `select * from expense where YEAR(createdat) = YEAR(NOW())- 1`;
      }
      if (date == "All Records") {
        return `select * from expense `;
      }
    }
    try {
        pool.query(getparams(date), (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${error}, 'server error', fetch custom expense`
        // );

        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      // logger.info(
      //   `${req.method} ${req.originalUrl},'success', fetch custom expense`
      // );

      res.status(200).json({ success: 1, data: result });
    });
  }
  catch (error) {
  }
  },

  getallexpense: (req, res) => {
    let sqlQuery = `select * from expense`;
    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, 'server error', fetch all expense`
        // );

        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      // logger.info(
      //   `${req.method} ${req.originalUrl},'success', fetch all expense`
      // );

      res.status(200).json({ success: 1, data: result });
    });
  }
  catch (error) {
  }
  },

  getallexpensehead: (req, res) => {
    let sqlQuery = `select * from expensehead`;
    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, 'server error', fetch all expense`
        // );

        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      // logger.info(
      //   `${req.method} ${req.originalUrl},'success', fetch all expense`
      // );

      res.status(200).json({ success: 1, data: result });
    });
  }
  catch (error) {
  }
  },

  updateExpense: async (req, res) => {
    //console.log('call')
    await uploadFile(req, res);
    console.log(req)

    const data = JSON.parse(req.body.data);
    let sqlQuery = `update expense set name ='${data.expensename}',date='${data.date}',expensehead='${data.expensehead}',invoice='${data.invoice}',amount='${data.amount}',documentlink='${data.link}',createdby='${data.createdby}',filename='${data.filename}'   where id = '${data.id}'`;
    console.log(sqlQuery)
    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update expense data`
        // );
        console.log(error)

        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }
      console.log(result)

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, update expense data: no record found`
        // );
        //console.log(reu)

        return res
          .status(200)
          .json({ success: 0, error: "update expense data: no record found" });
      }

      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, delete expense  by id`);
        let sqlQuery = `select * from expense`;
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
  updateExpenseHead: async (req, res) => {
    const data = req.body;
    let sqlQuery = `update expensehead set expensehead ='${data.expensehead}',createdat='${date}',createdby='${data.createdby}',notes='${data.notes}' where id = ${data.id}`;

    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update expense data`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }
      console.log(result)

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, update expense data: no record found`
        // );
        return res
          .status(200)
          .json({ success: 0, error: "update expense data: no record found" });
      }

      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, delete expense  by id`);
        let sqlQuery = `select * from expensehead`;
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

  updateExpensestatus: (req, res) => {
    let sqlQuery = `update expense set expense_status ='false'`;

    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update expense data`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, update expense data: no record found`
        // );
        return res
          .status(200)
          .json({ success: 0, error: "update expense data: no record found" });
      }

      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, delete expense  by id`);
        let sqlQuery = `select * from expense`;
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
  truncateTable: (req, res) => {
    let sqlQuery = `truncate table expense`;
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
        let sqlQuery1 = `truncate table expensehead`;
        try {
        pool.query(sqlQuery1, (error, result) => {
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
      }
      
    });
  }
  catch (error) {
  }
  },

  deleteSingleExpenseHead: (req, res) => {
    const id = req.params.id;
    let sqlQuery = `delete from expensehead where id = ${id}`;
    // let sqlQuery = `delete from expense`;

    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete expense head by id`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, delete expense head by  id: no  record found`
        // );
        return res.status(200).json({
          success: 0,
          error: "delete expense by id: no expense record found",
        });
      }
      if (result.affectedRows == 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, delete expense head by id`
        // );
        let sqlQuery = `select * from expensehead`;
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
  deleteSingleExpense: (req, res) => {
    const id = req.params.id;
    let sqlQuery = `delete from expense where id = ${id}`;
    // let sqlQuery = `delete from expense`;

    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete expense by id`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, delete expense by  id: no expense record found`
        // );
        return res.status(200).json({
          success: 0,
          error: "delete expense by id: no expense record found",
        });
      }
      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, delete expense  by id`);
        let sqlQuery = `select * from expense`;
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
  deleteallexpense: (req, res) => {
    const id = req.body;
    // let sqlQuery = `delete from expense where userId = ${id.expense_id}`;
    let sqlQuery = `delete from expense`;

    try {
        pool.query(sqlQuery, (error, result) => {
      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete expense by id`
        // );
        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });

      }

      if (result.affectedRows != 1) {
        // logger.info(
        //   `${req.method} ${req.originalUrl}, delete expense by  id: no expense record found`
        // );
        return res.status(200).json({
          success: 0,
          error: "delete expense by id: no expense record found",
        });
      }
      if (result.affectedRows == 1) {
        // logger.info(`${req.method} ${req.originalUrl}, delete expense  by id`);
        return res.status(200).json({
          success: 1,
          message: "expense deleted successfully",
        });
      }
    });
  }
  catch (error) {
  }
  },
};


// setTimeout(() => toast.dismiss(), 2000);