const pool = require("../../config/database.js");
// const logger = require("../../util/logger.js");
var createHash = require("hash-generator");

function checkGradTitleExist(data, callBack) {
  try {
    pool.query(
      `select * from grade where gradetitle = ? `,
      [data],

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
function getresult(data, res) {
  let sqlQuery =
    data.section != null
      ? `select student_id, firstName,lastName,otherName  from student where class = '${data.clazz}' and section = '${data.section}'  `
      : `select student_id, firstName,lastName,otherName  from student where class = '${data.clazz}'  `;

  try {
    pool.query(sqlQuery, async (error, result) => {
      console.log(sqlQuery);

      if (error) {
        // logger.info(
        //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
        // );
        console.log(error);

        return res
          .status(500)
          .json({ success: 0, error: "internal server error", message: error });
      }
      if (!result) {
        // logger.info(
        //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
        // );
        console.log("No results");

        return res
          .status(200)
          .json({ success: 0, data: [], message: "No reults Available" });
      }
      let finalArray = [];
      for (let i = 0; i < result.length; i++) {
        console.log(result[i].student_id);

        let datas = {
          id: result[i].student_id,
          session: data.session,
          examgroup: data.examgroup,
        };
        let retrieved = await getStudentsubjectresult(datas);
        console.log(retrieved);

        if (retrieved.length != 0) finalArray.push(retrieved);

        if (i + 1 == result.length) {
          let value = retrieved;
          console.log("done retrieval");
          res.status(200).json({ success: 1, data: finalArray });
        }
      }

      // let sqlQuery = `select * from examresult where session = '${data.session}' and examgroup = '${data.examgroup}' and student_id = '${data.stdid}'  `;
      // try {
      //    pool.query(sqlQuery, async (error, result) => {
      //   console.log(error);

      //   if (error) {
      //     // logger.info(
      //     //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
      //     // );
      //     console.log(error);

      //     return res
      //       .status(500)
      //       .json({
      //         success: 0,
      //         error: "internal server error",
      //         message: error,
      //       });
      //   }

      // logger.info(
      //   `${req.method} ${req.originalUrl},'success', fetch all sections`
      // );

      //   res.status(200).json({ success: 1, data: result });
      // });
    });

  }
  catch (error) {
  }

}
async function setposition(val) {
  const promise1 = await new Promise((resolve, reject) => {
    let scores = val.sort((a, b) => b.totalscore - a.totalscore);
    let currentPosition = 1;
    let previousScore = null;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i].totalscore !== previousScore) {
        currentPosition = i + 1;
      }
      scores[i].classposition = currentPosition;
      previousScore = scores[i].totalscore;

      if (i + 1 == scores.length) {
        // console.log(scores);
        console.log(" promise 1 isssssssssss");

        return resolve(scores);
      }
    }
  });
  console.log(promise1);
  return promise1;
}

async function setOverallpositions(data) {
  const promise1 = await new Promise((resolve, reject) => {
    let sqlQuery = `select  SUM(totalscore) as total from examresult where examresult.session = '${data.session}' and examresult.examgroup = '${data.examgroup}' and examresult.student_id = '${data.id}'  `;

    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(null);
          return console.log("result retrieve error");
        }
        if (results == null) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log("No results");

          return res
            .status(200)
            .json({ success: 0, data: [], message: "No reults Available" });
        }
        console.log(results);

        resolve(results);
        console.log("result retrieved successfully");
      });
    }
    catch (error) {
    }
  });
  let val = await promise1[0].total;
  console.log(data)

  console.log(
    "result retrieved successfullyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
  );
  // console.log(data.accumulatedscore);

  // async function splitAccumulated(data, val) {

  //   if (data.accumulatedscore == '0' || data.accumulatedscore == 0) return [(`${val}` + '$' + `${data.session}`).toString()].toString()

  //   if (data.accumulatedscore != '0' || data.accumulatedscore != 0) {
  //     let splitted = data.accumulatedscore.split(',')
  //     // let splitted = splitAccumulated(data.accumulatedscore)
  //     console.log(splitted)
  //     let bb = (`${val}` + '$' + `${data.session}`).toString()
  //     console.log(bb)
  //     let final = [...splitted, bb]
  //     console.log(final)
  //     return final.toString()
  //   }

  // }
  // let vv = await splitAccumulated(data, val)
  // const promise4 = await new Promise((resolve, reject) => {
  //   let sqlQuery1 = `update student set accumulatedscore = '${vv}' where student_id = '${data.id}' and session = '${data.session}' and examgroup = '${data.examgroup}'`
  //   //  let sqlQuery = `select  SUM(totalscore) as total from examresult where examresult.session = '${data.session}' and examresult.examgroup = '${data.examgroup}' and examresult.student_id = '${data.id}'  `;

  //   console.log(sqlQuery1);
  //   try {
  //     pool.query(sqlQuery1, (error, results, fields) => {
  //       if (error) {
  //         console.log(error);
  //         resolve(null);
  //         return console.log("result retrieve error");
  //       }
  //       if (results == null) {
  //         // logger.info(
  //         //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
  //         // );
  //         console.log("No results");

  //         return res
  //           .status(200)
  //           .json({ success: 0, data: [], message: "No reults Available" });
  //       }
  //       console.log(results);

  //       resolve(results);
  //       console.log("result retrieved successfully");
  //     });
  //   }
  //   catch (error) {
  //   }
  // });
  // // let val = await promise1[0].total;
  // console.log(
  //   "ACCUMULATED"
  // );
  // console.log(val);

  const promise2 = await new Promise((resolve, reject) => {
    let sqlQuery = `update examresult set overallscore = ${val} WHERE student_id = '${data.id}' and session = '${data.session}' and examgroup = '${data.examgroup}'`;

    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(null);
          return console.log("result retrieve error");
        }
        if (results == null) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log("No results");

          return res
            .status(200)
            .json({ success: 0, data: [], message: "No reults Available" });
        }
        resolve(results);
        console.log("result retrieved successfully");
      });
    }
    catch (error) {
    }
  });
  return promise1;
}
async function getStudentsubjectresult(data) {
  const promise1 = await new Promise((resolve, reject) => {
    let sqlQuery = `select examresult.*,student.firstName,student.lastName,student.otherName from examresult left join student on examresult.student_id = student.student_id where examresult.session = '${data.session}' and examresult.examgroup = '${data.examgroup}' and examresult.student_id = '${data.id}'  `;

    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(null);
          return console.log("result retrieve error");
        }
        if (results == null) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log("No results");

          return res
            .status(200)
            .json({ success: 0, data: [], message: "No reults Available" });
        }
        resolve(results);
        console.log("result retrieved successfully");
      });
    }
    catch (error) {
    }
  });
  return promise1;
}

async function updateResultposition(position, examid, student_id) {
  const promise1 = await new Promise((resolve, reject) => {
    let sqlQuery = `update examresult set position = '${position}' where examid = '${examid}' and student_id = '${student_id}' `;
    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(false);
          return console.log("error Inserting result group");
        }
        resolve(true);
        console.log("result inserted successfully");
      });
    }
    catch (error) {
    }
  });

  return promise1;
}
async function updateOverallposition(position, examclasscode, student_id) {
  const promise1 = await new Promise((resolve, reject) => {
    let sqlQuery = `update examresult set overallposition = '${position}' where examclasscode = '${examclasscode}' and student_id = '${student_id}' `;
    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(false);
          return console.log("error Inserting result group");
        }
        resolve(true);
        console.log("result inserted successfully");
      });
    }
    catch (error) {
    }
  });
  return promise1;
}
function checkExamGroupExist(data, callBack) {
  try {
    pool.query(
      `select * from grade where gradetitle = ? `,
      [data],

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
function checkExamExist(data, callBack) {
  try {
    pool.query(
      `select * from exam where class = '${data.class}' and section = '${data.section}' and session = '${data.session}' and examgroup = '${data.examgroup}' `,

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
function checkExamResultCodeExist(data, callBack) {
  console.log(" data  isssssssssssssssssssssss ");
  let query = `select * from examresultcode where class = '${data.classes}' and section = '${data.section}' and session = '${data.session}' and examgroup = '${data.examgroup}' and subject = '${data.subject}' `;
  console.log(query);

  try {
    pool.query(query, (error, results, fields) => {
      console.log(results);
      if (error) {
        callBack(error);
      }

      return callBack(null, results[0]);
    });
  }
  catch (error) {
  }
}
function checkResultTableExist(data, callBack) {
  try {
    pool.query(
      `SELECT
   resultid
FROM
   ${data}`,

      (error, results, fields) => {
        console.log("result");
        console.log(results);

        if (error) {
          callBack(error);
          return console.log("results is error");
        }
        console.log("results is perfect");

        return callBack(null, results);
      }
    );
  }
  catch (error) {
  }
}

async function creategradegroup(
  title,
  min,
  max,
  examscore,
  classscore,
  createdby,
  notes,
  grade,
  remarks,
  otherscore,
  code
) {
  const promise1 = await new Promise((resolve, reject) => {
    let date = new Date();
    date = date.toLocaleDateString("en-CA");
    let sqlQuery = `insert into grade (gradetitle,minscore,gradecode,maxscore,exampercent,classworkpercent,createdby,createdat,notes,grades,scoreremarks,otherscorepercent) values
 ('${title}','${min}','${code}','${max}','${examscore}','${classscore}','${createdby}','${date}','${notes}','${grade}','${remarks}','${otherscore}')`;
    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(false);
          return console.log("error creating grade group");
        }
        resolve(true);
        console.log("grade group logged created successfully");
      });
    }
    catch (error) {
    }
  });

  return promise1;
}
async function gradeMaker(val, gradeArray) {
  let myarr = ["", ""];
  for (let i = 0; i < gradeArray.length; i++) {
    if (gradeArray[i].minscore <= val && val <= gradeArray[i].maxscore) {
      myarr[0] = gradeArray[i].scoreremarks;
      myarr[1] = gradeArray[i].grades;
    }
  }
  return myarr;
}
async function insertResult(
  examid,
  subject,
  student_id,
  totalscore,
  classscore,
  rawclass,
  examscore,
  rawexam,
  grade,
  remarks,
  otherscore,
  examtable,
  session,
  examgroup,
  classcode,
  size, exampercent, classworkpercent, otherpercent
) {
  const promise1 = await new Promise((resolve, reject) => {
    let date = new Date();
    date = date.toLocaleDateString("en-CA");
    let sqlQuery = `insert into examresult (examid,examclasscode,subject,student_id,totalscore,examscore,classworkscore,grade,examremark,othersscore,session,examgroup,classize,exampercent,classworkpercent,otherpercent,rawclassscore,rawexamscore) values
                                            ('${examid}','${classcode}','${subject}','${student_id}','${totalscore}','${Math.round(examscore)}','${Math.round(classscore)}','${grade}','${remarks}','0','${session}','${examgroup}','${size}','${exampercent}','${classworkpercent}','${otherpercent}','${rawclass}','${rawexam}')`;
    console.log(sqlQuery);

    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(false);
          return console.log("error Inserting result group");
        }
        resolve(true);
        console.log("result inserted successfully");
      });
    }
    catch (error) {
    }
  });

  return promise1;
}

let date = new Date();
module.exports = {
  updategradegroup: async (req, res) => {
    let data = req.body;


    let sqlQuery4 = `update examresultcode set chosengrade ='${data.title}' where chosengrade ='${data.formertitle}'`;

    const promise4 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery4, (error, result) => {
          if (error) {

          }
          console.log('attendance cleared')
          resolve(true)
        });
      }
      catch (error) {
      }
    });
    let p2 = promise4





    const promise2 = await new Promise((resolve, reject) => {

      let sqlQuery = `Delete from grade where gradecode = '${data.code}'  `;

      console.log(sqlQuery);
      try {
        pool.query(sqlQuery, (error, results, fields) => {
          if (error) {
            console.log(error);
            resolve(null);
            return console.log(error);
          }
          if (results == null) {
            // logger.info(
            //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
            // );
            console.log("No results");

            return res
              .status(200)
              .json({ success: 0, data: [], message: "No reults Available" });
          }
          console.log(results);

          resolve(results);
          console.log("result deleted successfully");
        });
      }
      catch (error) {
      }
    });
    let val = await promise2;

    const promise1 = await new Promise((resolve, reject) => {
      console.log(val);
      checkGradTitleExist(data.title, async (err, results) => {
        if (results) {
          console.log("Create Grade Group Title Exists");
          resolve(true);
          return res
            .status(200)
            .json({ success: 0, data: null, message: "Group Title Exists" });
        } else {
          for (let i = 0; i < data.grades.length; i++) {
            let title = data.title;
            let code = data.code;
            let notes = data.notes;
            let examscore = data.examScore;
            let classscore = data.classscore;
            let otherscore = data.otherScore;

            let createdby = data.createdby;

            let min = data.grades[i].minscore;
            let max = data.grades[i].maxscore;
            let grade = data.grades[i].grades;
            let remarks = data.grades[i].scoreremarks;
            console.log(data.grades[i]);
            let create = await creategradegroup(
              title,
              min,
              max,
              examscore,
              classscore,
              createdby,
              notes,
              grade,
              remarks,
              otherscore,
              code
            );
            if (create == false)
              res.status(200).json({
                success: 0,
                data: undefined,
                message: "Internal Server Error",
              });

            if (i + 1 == data.grades.length) {
              let bb = create;
              console.log(bb);
              console.log("successful creation");

              let sqlQuery = `SELECT DISTINCT(grade.gradetitle), exampercent,classworkpercent,gradeid,gradecode,createdby,otherscorepercent from grade group by gradetitle order by gradeid desc`;
              try {
                pool.query(sqlQuery, (error, result) => {
                  console.log(error);

                  if (error) {
                    // logger.info(
                    //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                    // );
                    console.log(error);

                    return res.status(500).json({
                      success: 0,
                      error: "internal server error",
                      message: error,
                    });
                  }

                  // logger.info(
                  //   `${req.method} ${req.originalUrl},'success', fetch all Class`
                  // );

                  res.status(200).json({ success: 1, data: result });
                });
              }
              catch (error) {
              }
            }

          }
        }
      });
    });
  },
  creategradegroup: async (req, res) => {
    let data = req.body;
    console.log(data);
    const promise1 = await new Promise((resolve, reject) => {
      checkGradTitleExist(data.title, async (err, results) => {
        if (results) {
          console.log("Create Grade Group Title Exists");
          resolve(true);
          return res
            .status(200)
            .json({ success: 0, data: null, message: "Group Title Exists" });
        } else {
          for (let i = 0; i < data.grades.length; i++) {
            let title = data.title;
            let code = data.code;
            let notes = data.notes;
            let examscore = data.examScore;
            let classscore = data.classscore;
            let otherscore = data.otherScore;

            let createdby = data.createdby;

            let min = data.grades[i][0];
            let max = data.grades[i][1];
            let grade = data.grades[i][2];
            let remarks = data.grades[i][3];
            console.log(data.grades[i]);
            let create = await creategradegroup(
              title,
              min,
              max,
              examscore,
              classscore,
              createdby,
              notes,
              grade,
              remarks,
              otherscore,
              code
            );
            if (create == false)
              res.status(200).json({
                success: 0,
                data: undefined,
                message: "Internal Server Error",
              });

            if (i + 1 == data.grades.length) {
              let bb = create;
              console.log(bb);
              console.log("successful creation");

              let sqlQuery = `SELECT DISTINCT(grade.gradetitle), exampercent,classworkpercent,gradeid,gradecode,createdby,otherscorepercent from grade group by gradetitle order by gradeid desc`;


              try {
                pool.query(sqlQuery, (error, result) => {
                  console.log(error);

                  if (error) {
                    // logger.info(
                    //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                    // );
                    console.log(error);

                    return res.status(500).json({
                      success: 0,
                      error: "internal server error",
                      message: error,
                    });
                  }

                  // logger.info(
                  //   `${req.method} ${req.originalUrl},'success', fetch all Class`
                  // );
                  console.log(result);
                  res.status(200).json({ success: 1, data: result });
                });
              }
              catch (error) {
              }
            }
          }
        }
      });
    });
  },
  createnewexam: async (req, res) => {
    let data = req.body;
    let resultTable = data.examtable;

    checkExamExist(data, (err, results) => {
      if (results) {
        console.log("Create new Exam  Exists For Academic Session");
        return res.status(200).json({
          success: 0,
          data: null,
          message: "Exam Already Exist For Academic Session",
        });
      } else {
        function hashgenerator(num) {
          return createHash(num);
        }
        var code = hashgenerator(6);
        let date = new Date();
        date = date.toLocaleDateString("en-CA");

        if (data.section == "None") {
          let sqlQuery1 = `insert into exam (examcode,createdat,createdby,notes,examgroup,class,subject,session,examtable,gradingtype) values
          ('${code}','${date}','${data.createdby}','${data.notes}','${data.examgroup}','${data.class}','${data.subjects}','${data.session}','${resultTable}','${data.chosengrade}')`;
          try {
            pool.query(sqlQuery1, (error, result) => {
              if (error) {
                // logger.info(
                //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                // );
                console.log("Error creating examgroup");
                console.log(error);

                return res.status(500).json({
                  success: 0,
                  error: "internal server error",
                  message: error,
                });
              }
              let sqlQuery = `SELECT * from exam order by examsid desc `;
              try {
                pool.query(sqlQuery, (error, resultz) => {
                  console.log(error);

                  if (error) {
                    // logger.info(
                    //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                    // );
                    console.log(error);

                    return res.status(500).json({
                      success: 0,
                      error: "internal server error",
                      message: error,
                    });
                  }

                  console.log(
                    `${req.method} ${req.originalUrl},'success', fetch all exam`
                  );

                  res.status(200).json({ success: 1, data: resultz });
                });
              }
              catch (error) {
              }
            });
          }
          catch (error) {
          }
        } else {
          let sqlQuery1 = `insert into exam (examcode,createdat,createdby,notes,examgroup,class,section,subject,session,examtable,gradingtype) values
          ('${code}','${date}','${data.createdby}','${data.notes}','${data.examgroup}','${data.class}','${data.section}','${data.subjects}','${data.session}','${resultTable}','${data.chosengrade}')`;
          try {
            pool.query(sqlQuery1, (error, result) => {
              if (error) {
                // logger.info(
                //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                // );
                console.log("Error creating examgroup");
                console.log(error);

                return res.status(500).json({
                  success: 0,
                  error: "internal server error",
                  message: error,
                });

              }

              let sqlQuery = `SELECT * from exam order by examsid desc `;
              try {
                pool.query(sqlQuery, (error, resultz) => {
                  console.log(error);

                  if (error) {
                    // logger.info(
                    //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                    // );
                    console.log(error);

                    return res.status(500).json({
                      success: 0,
                      error: "internal server error",
                      message: error,
                    });
                  }

                  console.log(
                    `${req.method} ${req.originalUrl},'success', fetch all exam`
                  );

                  res.status(200).json({ success: 1, data: resultz });
                });
              }
              catch (error) {
              }
            });
          }
          catch (error) {
          }
        }
      }

    });

  },
  updateremarksgroup: async (req, res) => {
    let data = req.body;

   
        let sqlQuery1 = `update  examremarkgroup set text ='${data.text}' where id='${data.id}'`
        try {
          pool.query(sqlQuery1, (error, result) => {
            if (error) {
              // logger.info(
              //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
              // );
              console.log("Error creating examgroup");

              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            }
            let sqlQuery = `SELECT * from examremarkgroup `;
            try {
              pool.query(sqlQuery, (error, resultz) => {
                console.log(error);

                if (error) {
                  // logger.info(
                  //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                  // );
                  console.log(error);

                  return res.status(500).json({
                    success: 1,
                    data: resultz,
                  });
                }

                // logger.info(
                //   `${req.method} ${req.originalUrl},'success', fetch all Class`
                // );

                res.status(200).json({ success: 1, data: resultz });
              });
            }
            catch (error) {
            }
          });
        }
        catch (error) {
        }
      
    
  },
  examremarksgroup: async (req, res) => {
    let data = req.body;

   
        let sqlQuery1 = `insert into examremarkgroup (text,createdat,createdby) values
          ('${data.title}','${date}','${data.createdby}')`;
        try {
          pool.query(sqlQuery1, (error, result) => {
            if (error) {
              // logger.info(
              //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
              // );
              console.log("Error creating examgroup");

              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            }
            let sqlQuery = `SELECT * from examremarkgroup `;
            try {
              pool.query(sqlQuery, (error, resultz) => {
                console.log(error);

                if (error) {
                  // logger.info(
                  //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                  // );
                  console.log(error);

                  return res.status(500).json({
                    success: 1,
                    data: resultz,
                  });
                }

                // logger.info(
                //   `${req.method} ${req.originalUrl},'success', fetch all Class`
                // );

                res.status(200).json({ success: 1, data: resultz });
              });
            }
            catch (error) {
            }
          });
        }
        catch (error) {
        }
      
    
  },
  createexamgroup: async (req, res) => {
    let data = req.body;

    checkExamGroupExist(data.title, (err, results) => {
      if (results) {
        console.log("Create Exam Group Title Exists");
        resolve(true);
        return res
          .status(200)
          .json({ success: 0, data: null, message: "Group Title Exists" });
      } else {
        let sqlQuery1 = `insert into examgroup (grouptitle,createdat,createdby) values
          ('${data.title}','${date}','${data.createdby}')`;
        try {
          pool.query(sqlQuery1, (error, result) => {
            if (error) {
              // logger.info(
              //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
              // );
              console.log("Error creating examgroup");

              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            }
            let sqlQuery = `SELECT * from examgroup `;
            try {
              pool.query(sqlQuery, (error, resultz) => {
                console.log(error);

                if (error) {
                  // logger.info(
                  //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                  // );
                  console.log(error);

                  return res.status(500).json({
                    success: 1,
                    data: resultz,
                  });
                }

                // logger.info(
                //   `${req.method} ${req.originalUrl},'success', fetch all Class`
                // );

                res.status(200).json({ success: 1, data: resultz });
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
  },
  stdperformance: (req, res) => {
    let data = req.body;
    let sqlQuery = `SELECT DISTINCT session,student_id,overallscore FROM examresult where student_id='${data.id}' `;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(
          result
        );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  gradegroupbyid: (req, res) => {
    let data = req.body;
    let sqlQuery = `SELECT * from grade where gradecode='${data.code}' `;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(
          `${result} ${req.originalUrl},'success', fetch grade group by code`
        );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getexamlist: (req, res) => {
    let sqlQuery = `SELECT * from examresultcode order by id desc  `;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${result} ${req.originalUrl},'success', fetch all Exam`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getexamremarksgroup: async (req, res) => {
    let sqlQuery = `SELECT * from examremarkgroup  `;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${result} ${req.originalUrl},'success', fetch all Class`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getexamgroup: async (req, res) => {
    let sqlQuery = `SELECT * from examgroup  `;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${result} ${req.originalUrl},'success', fetch all Class`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getexamresult: (req, res) => {
    let data = req.body;
    let sqlQuery = `select examresult.* , student.student_id,student.firstName,student.otherName, student.lastName,student.section, student.class from examresult  left join student on examresult.student_id = student.student_id  where examresult.examid = '${data.examid}'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all sections`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  addexamresult: async (req, res) => {
    let data = req.body;
    let examid = data.examid;
    //let createdby = data.createdby;
    let session = data.session;
    let subject = data.subject;
    let examtable = data.examtable;
    let examgroup = data.examgroup;
    let classcode = data.classexamid;
    let size = data.classsize;
    let exampercent = data.exampercent;
    let classpercent = data.classpercent;
    let otherpercent = 0;
    console.log(data);

    if (!data.result) return res.status(200).json({
      success: 0,
      error: "Empty Result Data",
      message: "Empty Result Data"
    });

    let sqlQuery = `insert into examresultcode (code,subject,class,section,session,examgroup,createdat,createdby,chosengrade) values
          ('${data.examid}','${subject}','${data.classes}','${data.section}','${data.session}','${data.examgroup}','${date}','${data.createdby}','${data.chosengrade}')`;

    checkExamResultCodeExist(data, (err, results) => {
      if (results) {
        console.log("Create new Exam  Exists For Academic Session");
        return res.status(200).json({
          success: 0,
          data: null,
          message: "Exam Already Exist For Academic Session",
        });
      } else {
        console.log("exam code is not registered");

        try {
          pool.query(sqlQuery, async (error, resulty) => {
            if (error) {
              // logger.info(
              //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
              // );
              console.log(error);

              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            } else if (resulty.affectedRows == 1) {
              for (let i = 0; i < data.result.length; i++) {
                let title = data.title;
                let notes = data.notes;
                let student_id = data.result[i].student_id;
                let examscore =
                  data.result[i].examScore == "" ? 0 : data.result[i].examScore;
                let classscore =
                  data.result[i].classWorkScore == ""
                    ? 0
                    : data.result[i].classWorkScore;
                let otherscore = 0
                let examscorep = examscore == 0 ? 0 : examscore * (exampercent / 100)
                let otherscorep = 0
                let classscorep = classscore == 0 ? 0 : classscore * (classpercent / 100)
                let totalscore = Math.ceil(
                  (examscore == 0 ? 0 : examscore * (exampercent / 100)) +

                  (classscore == 0 ? 0 : classscore * (classpercent / 100))
                );

                let Grader = await gradeMaker(totalscore, data.gradeArray);

                let create = await insertResult(
                  examid,
                  subject,
                  student_id,
                  totalscore,
                  classscorep,
                  classscore,
                  examscorep,
                  examscore,
                  Grader[1],
                  Grader[0],
                  otherscorep,
                  examtable,
                  session,
                  examgroup,
                  classcode,
                  size, exampercent, classpercent, otherpercent
                );

                if (i + 1 == data.result.length && create == true) {
                  console.log(create);
                  let vv = create;
                  console.log("Successsssssssssssssssssssssssssssssssssss");
                  //get result inorder to set positions
                  let sqlQuery = `SELECT examresult.*, student.firstName,student.lastName,student.otherName from examresult left join student on examresult.student_id = student.student_id where examid = '${examid}'`;
                  try {
                    pool.query(sqlQuery, async (error, result) => {
                      console.log(error);

                      if (error) {
                        // logger.info(
                        //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                        // );
                        console.log(error);

                        return res.status(500).json({
                          success: 0,
                          error: "internal server error",
                          message: error + "result inserted but no position set",
                        });
                      }

                      console.log(
                        `${result} ${req.originalUrl},'success', fetch all result for positioning`
                      );
                      let sortedArray = await setposition(result);
                      console.log("sortedArray array is");
                      console.log(sortedArray.length);

                      if (sortedArray.length) {
                        for (let i = 0; i < sortedArray.length; i++) {
                          let cover = await updateResultposition(
                            sortedArray[i].classposition,
                            sortedArray[i].examid,
                            sortedArray[i].student_id
                          );
                          console.log(cover);
                        }
                        if (i + 1 == sortedArray.length) {
                          return res.status(200).json({
                            success: 1,
                            data: sortedArray,
                          });
                        }
                      }
                    });
                  }
                  catch (error) {
                  }
                }

                if (i + 1 == data.result.length && create == false) {
                  console.log(create);
                  let vv = create;

                  return res.status(200).json({
                    success: 0,
                    data: [],
                    message: "Error inserting Result",
                  });
                }
              }
            }

            // console.log(` ${req.originalUrl},'success', fetch all Class`);

            // res.status(200).json({ success: 1, data: resulty });
          });

        }
        catch (error) {
        }

      }
    });
  },
  Updateexamresult: async (req, res) => {

    let data = req.body;

    //return console.log(data)
    let examid = data.examid;
    //let createdby = data.createdby;
    let session = data.session;
    let subject = data.subject;
    let examtable = data.examtable;
    let examgroup = data.examgroup;
    let classcode = data.classcode;
    let size = data.classsize;
    let exampercent = data.exampercent;
    let classpercent = data.classpercent;
    let otherpercent = 0;

    if (!data.result) return res.status(200).json({
      success: 0,
      error: "Empty Result Data",
      message: "Empty Result Data"
    });

    const promise1 = await new Promise((resolve, reject) => {
      let sqlQuery = `Delete from examresult where examid = '${data.examid}'  `;

      console.log(sqlQuery);
      try {
        pool.query(sqlQuery, (error, results, fields) => {
          if (error) {
            console.log(error);
            resolve(null);
            return console.log("result retrieve error");
          }
          if (results == null) {
            // logger.info(
            //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
            // );
            console.log("No results");

            return res
              .status(200)
              .json({ success: 0, data: [], message: "No reults Available" });
          }
          console.log(results);

          resolve(results);
          console.log("result deleted successfully");
        });
      }
      catch (error) {
      }
    });
    let val = await promise1;
    console.log("promise1");

    let sqlQuery = `update examresultcode set createdby = '${data.createdby}', createdat = '${date}' where code = '${examid}'`;

    try {
      pool.query(sqlQuery, async (error, resulty) => {
        console.log(sqlQuery);
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res.status(500).json({
            success: 0,
            error: "internal server error",
            message: error,
          });
        } else if (resulty) {
          console.log(error);
          console.log(data.result.length);
          console.log("Yet to run");

          for (let i = 0; i < data.result.length; i++) {
            let title = data.title;
            let notes = data.notes;
            let student_id = data.result[i].student_id;
            let examscore =
              data.result[i].rawexamscore == "" ? 0 : data.result[i].rawexamscore;
            let classscore =
              data.result[i].rawclassscore == ""
                ? 0
                : data.result[i].rawclassscore;
            let otherscore = 0
            let examscorep = examscore == 0 ? 0 : examscore * (exampercent / 100)
            let otherscorep = 0
            let classscorep = classscore == 0 ? 0 : classscore * (classpercent / 100)
            let totalscore = Math.ceil(
              (examscore == 0 ? 0 : examscore * (exampercent / 100)) +

              (classscore == 0 ? 0 : classscore * (classpercent / 100))
            );

            let Grader = await gradeMaker(totalscore, data.gradeArray);

            let create = await insertResult(
              examid,
              subject,
              student_id,
              totalscore,
              classscorep,
              classscore,
              examscorep,
              examscore,
              Grader[1],
              Grader[0],
              otherscorep,
              examtable,
              session,
              examgroup,
              classcode,
              size, exampercent, classpercent, otherpercent
            );

            if (i + 1 == data.result.length && create == true) {
              console.log(create);
              let vv = create;
              console.log("Successsssssssssssssssssssssssssssssssssss");
              //get result inorder to set positions
              let sqlQuery = `SELECT examresult.*, student.firstName,student.lastName,student.otherName from examresult left join student on examresult.student_id = student.student_id where examid = '${examid}'`;
              try {
                pool.query(sqlQuery, async (error, result) => {
                  console.log(error);

                  if (error) {
                    // logger.info(
                    //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                    // );
                    console.log(error);

                    return res.status(500).json({
                      success: 0,
                      error: "internal server error",
                      message: error + "result inserted but no position set",
                    });
                  }

                  console.log(
                    `${result} ${req.originalUrl},'success', fetch all result for positioning`
                  );
                  let sortedArray = await setposition(result);
                  console.log("sortedArray array is");
                  console.log(sortedArray.length);

                  if (sortedArray.length) {
                    for (let i = 0; i < sortedArray.length; i++) {
                      let cover = await updateResultposition(
                        sortedArray[i].classposition,
                        sortedArray[i].examid,
                        sortedArray[i].student_id
                      );
                      console.log(cover);
                    }
                    if (i + 1 == sortedArray.length) {
                      return res.status(200).json({
                        success: 1,
                        data: sortedArray,
                      });
                    }
                  }
                });
              }
              catch (error) {
              }
            }

            if (i + 1 == data.result.length && create == false) {
              console.log(create);
              let vv = create;

              return res.status(200).json({
                success: 0,
                data: [],
                message: "Error inserting Result",
              });
            }
          }
        }

        // console.log(` ${req.originalUrl},'success', fetch all Class`);

        // res.status(200).json({ success: 1, data: resulty });
      });
    }
    catch (error) {
    }
  },
  getexamsubject: (req, res) => {
    let data = req.body;
    let sqlQuery = `select * from examresultcode where class = '${data.class}' and section = '${data.section}' and session = '${data.session}' and examgroup = '${data.examgroup}' `;
    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(` ${req.originalUrl},'success', fetch all Class`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getgradegroupbyName: (req, res) => {
    let data = req.body;
    let sqlQuery = `select * from grade where gradetitle = '${data.title}'`;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(` ${req.originalUrl},'success', fetch all Class`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getexambycode: (req, res) => {
    let data = req.body;
    let sqlQuery = `SELECT examresult.*,student.firstName,student.lastName,student.otherName,student.class,student.section from examresult left join student on examresult.student_id = student.student_id where examresult.examid = '${data.id}'`;
    console.log(sqlQuery);
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${result} ${req.originalUrl},'success', fetch all Class`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  deleteexam: async (req, res) => {

    const id = req.body;
    const promise1 = await new Promise((resolve, reject) => {

      let sqlQuery = `delete from examresultcode where id = '${id.id}'`;

      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete Class by id`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }


          if (result.affectedRows) {
            resolve(true)
            console.log('deleted successful code')
          }

        });
      }
      catch (error) {
      }
    });
    let pro = promise1

    const promise2 = await new Promise((resolve, reject) => {

      let sqlQuery = `delete from examresult where examid = '${id.code}'`;

      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)
          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete Class by id`
            // );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }

          if (!result.affectedRows) {
            // logger.info(
            //   `${req.method} ${req.originalUrl}, delete Class by  id: no Class record found`
            // );
            return res.status(300).json({
              success: 0,
              message: error,
              error: "Error deleteing",
            });
          }
          if (result.affectedRows) {
            console.log('deleted successful result')

            pool.query(sqlQuery, (error, result) => {
              res.status(200).json({ success: 1, data: result });
            });

          }

        });
      }
      catch (error) {
      }
    });
    let pro1 = promise2


  },
  deletexamgrade: (req, res) => {
    console.log(req)

    const id = req.body.id;
    let sqlQuery = `delete from grade where gradecode = '${id}'`;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(result)
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete Class by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete Class by  id: no Class record found`
          // );
          return res.status(200).json({
            success: 0,
            message: error,
            error: "Error deleteing",
          });
        }
        if (result.affectedRows) {
          // logger.info(`${req.method} ${req.originalUrl}, delete Class  by id`);
          //return table data
          let sqlQuery = `SELECT DISTINCT(grade.gradetitle), exampercent,classworkpercent,gradeid,gradecode,createdby,otherscorepercent from grade group by gradetitle order by gradeid desc`;
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
  deleteGroup: (req, res) => {
    console.log(req)

    const id = req.body.id;
    let sqlQuery = `delete from examgroup where id = '${id}'`;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(result)
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete Class by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete Class by  id: no Class record found`
          // );
          return res.status(200).json({
            success: 0,
            message: error,
            error: "Error deleteing",
          });
        }
        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, delete Class  by id`);
          //return table data
          let sqlQuery = `SELECT * from examgroup`;
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
  getgradegroup: (req, res) => {
    let sqlQuery = `SELECT DISTINCT(grade.gradetitle), exampercent,classworkpercent,gradeid,createdby,gradecode,otherscorepercent from grade group by gradetitle order by gradeid desc`;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${result} ${req.originalUrl},'success', fetch all Class`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  searchcustom: (req, res) => {
    let data = req.body;
    let sqlQuery = `select * from examresultcode where session = '${data.session}' and examgroup = '${data.examgroup}' `;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all sections`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  singlereport: (req, res) => {
    let data = req.body;
    let sqlQuery = `select * from examresult where session = '${data.session}' and examgroup = '${data.examgroup}' and student_id = '${data.stdid}'  `;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(result);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        if (result.length == 0) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );

          return res
            .status(200)
            .json({ success: 0, data: [], message: "No Resullts Available" });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all sections`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  genrateAllreport: async (req, res) => {
    let data1 = req.body;
    console.log(data1);

    const promise1 = await new Promise((resolve, reject) => {

      let sqlQuery = `select * from class `;

      pool.query(sqlQuery, (error, result) => {
        resolve(result)
      });
    });

    let data = promise1
    // return  console.log(data)

    let examgroup = data1.examgroup
    let session = data1.session
    //data.classcode = data.classId
    // data.class = data.title

    for (const data of promise1) {
      console.log(data)


      data.section = data.section == null ? 'NONE' : data.section
      let sqlQuery = `select student_id, firstName,lastName,otherName,accumulatedscore  from student where class = '${data.title}' and section = '${data.section}'`

      try {
        pool.query(sqlQuery, async (error, result) => {
          console.log(sqlQuery);

          if (error) {
            // logger.info(
            //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
            // );
            console.log(error);

            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          if (!result) {
            // logger.info(
            //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
            // );
            console.log("No results");

            return res
              .status(200)
              .json({ success: 0, data: [], message: "No reults Available" });
          }
          let finalArray = [];
          for (let i = 0; i < result.length; i++) {
            console.log(result[i].student_id);

            let datas = {
              id: result[i].student_id,
              session: session,
              examgroup: examgroup,
              accumulatedscore: result[i].accumulatedscore
            };
            let retrieved = await setOverallpositions(datas);
            //   console.log(retrieved);

            if (i + 1 == result.length) {
              console.log(result.length);
              console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');


              let value = retrieved;
              //get all student of the class using unique classcode
              let sqlQuery = `select distinct(student_id),overallscore as totalscore,examclasscode  from examresult where examclasscode = '${data.classexamid}'`;
              try {
                pool.query(sqlQuery, async (error, result) => {
                  console.log(error);

                  if (error) {
                    // logger.info(
                    //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                    // );
                    console.log(error);

                    return res.status(500).json({
                      success: 0,
                      error: "internal server error",
                      message: error,
                    });
                  }
                  if (result.length == 0) {
                    //    return   res.status(200).json({ success: 1, message: 'Generated Successfully' });
                  }

                  if (result) {
                    let sort = await setposition(result);
                    console.log(sort);
                    async function forEachAsync(sort) {
                      for (const element of sort) {
                        console.log(element);
                        let kk = updateOverallposition(
                          element.classposition,
                          element.examclasscode,
                          element.student_id
                        );
                        console.log("kk");
                      }
                    }

                    async function main(sort) {
                      await forEachAsync(sort);
                      console.log("Array.forEach() has finished running.");
                    }
                    main(sort);

                    //get the result to be printed
                    // getresult(data, res);

                  }
                });
                console.log("done retrieval");

                res.status(200).json({ success: 1, message: 'Generated Successfully' });

              }
              catch (error) {
              }
            }
            console.log(result.length);

          }
        });
      }
      catch (error) {
      }
    }
  },
  genrateclassreport: async (req, res) => {
    let data = req.body;
    console.log(data);
    const promise1 = await new Promise((resolve, reject) => {

      let sqlQuery1 = `select * from class where title = '${data.clazz}'`;
      let sqlQuery2 = `select * from class where title = '${data.clazz}' and section = '${data.section}' `;

      let sqlQuery = sqlQuery2

      pool.query(sqlQuery, (error, result) => {

        resolve(result)
      });
    });
    console.log(promise1)
    if (promise1[0] == undefined) {
      return res.status(200).json({ success: 0, data: [], message: "Invalid Class & Section Pair " });
    }
    let classinfo = promise1[0]

    let sqlQuery = data.section != 'NONE'
      ? `select student_id, firstName,lastName,otherName,accumulatedscore  from student where class = '${data.clazz}' and section = '${data.section}'  `
      : `select student_id, firstName,lastName,otherName,accumulatedscore  from student where class = '${data.clazz}'  `;

    try {
      pool.query(sqlQuery, async (error, result) => {
        console.log(sqlQuery);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        if (result.length == 0) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log("No results");

          return res
            .status(200)
            .json({ success: 0, data: [], message: "No reults Available" });
        }

        let finalArray = [];
        console.log(result);

        for (let i = 0; i < result.length; i++) {
          console.log(result[i].student_id);

          let datas = {
            id: result[i].student_id,
            session: data.session,
            examgroup: data.examgroup,
            accumulatedscore: result[i].accumulatedscore
          };
          let retrieved = await setOverallpositions(datas);

          console.log(retrieved);

          if (i + 1 == result.length) {
            let value = retrieved;

            //get all student of the class using unique classcode
            let sqlQuery = `select distinct(student_id),overallscore as totalscore,examclasscode  from examresult where examclasscode = '${classinfo.classexamid}'`;
            try {
              pool.query(sqlQuery, async (error, result) => {
                console.log(sqlQuery);

                if (error) {
                  // logger.info(
                  //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
                  // );
                  console.log(error);

                  return res.status(500).json({
                    success: 0,
                    error: "internal server error",
                    message: error,
                  });
                }
                console.log(result)
                console.log('resujjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjltggggggggggggggggggggggggggggggg')
                console.log(promise1)
                if (result.length == 0) {
                  return res.status(200).json({ success: 0, data: [], message: "No Exam Results Available" });
                }
                if (result) {
                  let sort = await setposition(result);
                  console.log(sort);
                  async function forEachAsync(sort) {
                    for (const element of sort) {
                      console.log(element);
                      let kk = updateOverallposition(
                        element.classposition,
                        element.examclasscode,
                        element.student_id
                      );
                      console.log("kk");
                    }
                  }

                  async function main(sort) {
                    await forEachAsync(sort);
                    console.log("tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttArray.forEach() has finished running.");
                  }
                  main(sort);

                  //get the result to be printed
                  // getresult(data, res);
                  res.status(200).json({ success: 1, message: 'Generated Successfully' });

                }
              });

              console.log("done retrieval");
            }
            catch (error) {
            }
          }

        }
      });
    }
    catch (error) {
    }

  },
  getClassreport: async (req, res) => {
    let data = req.body;
    let sqlQuery =
      data.section != null
        ? `select student_id, firstName,lastName,otherName  from student where class = '${data.clazz}' and section = '${data.section}'  `
        : `select student_id, firstName,lastName,otherName  from student where class = '${data.clazz}'  `;

    try {
      pool.query(sqlQuery, async (error, result) => {
        console.log(sqlQuery);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        if (!result) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log("No results");

          return res
            .status(200)
            .json({ success: 0, data: [], message: "No reults Available" });
        }
        let finalArray = [];
        for (let i = 0; i < result.length; i++) {
          console.log(result[i].student_id);

          let datas = {
            id: result[i].student_id,
            session: data.session,
            examgroup: data.examgroup,
          };
          let retrieved = await getStudentsubjectresult(datas);
          console.log(retrieved);

          if (retrieved.length != 0) finalArray.push(retrieved);

          if (i + 1 == result.length) {
            let value = retrieved;
            console.log("done retrieval");
            res.status(200).json({ success: 1, data: finalArray });
          }
        }

        // let sqlQuery = `select * from examresult where session = '${data.session}' and examgroup = '${data.examgroup}' and student_id = '${data.stdid}'  `;
        // try {
        // pool.query(sqlQuery, async (error, result) => {
        //   console.log(error);

        //   if (error) {
        //     // logger.info(
        //     //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
        //     // );
        //     console.log(error);

        //     return res
        //       .status(500)
        //       .json({
        //         success: 0,
        //         error: "internal server error",
        //         message: error,
        //       });
        //   }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all sections`
        // );

        //   res.status(200).json({ success: 1, data: result });
        // });
      });
    }
    catch (error) {
    }
  },
  updateexamcartegory: async (req, res) => {
    let data = req.body;


    let sqlQuery2 = `update examresult set examgroup ='${data.title}' where examgroup ='${data.formertitle}'`;
    let sqlQuery3 = `update examresultcode set examgroup ='${data.title}' where examgroup ='${data.formertitle}'`;

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



    let sqlQuery = `update examgroup set grouptitle ='${data.title}' where id = '${data.id}' `;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(
          `${req.method} ${req.originalUrl},'success', update exam cartegory successful`
        );
        let sqlQuery = `select * from examgroup`;
        try {
          pool.query(sqlQuery, (error, result) => {
            console.log(error);
            // logger.info(
            //   `${req.method} ${req.originalUrl},'success', fetch all Class`
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
  setremark: (req, res) => {
    let data = req.body;
    let sqlQuery = `update examresult set teacherreamark ='${data.remark}' where session = '${data.session}' and examgroup = '${data.examgroup}' and student_id = '${data.id}' `;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(
          `${req.method} ${req.originalUrl},'success', remark set successfully`
        );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getdetailgradegroup: (req, res) => {
    let sqlQuery = `select * from grade`;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all Class`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getAllSection: (req, res) => {
    let sqlQuery = `select * from section where isActive = 'true'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all sections`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getsectionByClassId: (req, res) => {
    let id = req.body.classId;

    let sqlQuery = `select * from section where classId = '${id}'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all sections`
        // );
        console.log(result);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getAllSectiongroup: (req, res) => {
    let sqlQuery = `select * from sectiongroup where isActive = 'true'`;
    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(error);

        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all sections`
          // );
          console.log(error);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all sections`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getAllClassWithSection: (req, res) => {
    let sqlQuery = `select class.classId, class.title ,section.sectionName from class inner join section on class.classId = section.classId  order by class.title asc`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${error}, 'server error', fetch all Class with section`
          // );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all Class with section`
        // );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  updateClass: (req, res) => {
    const data = req.body;

    console.log(data);
    let sqlQuery = `update class set title ='${data.title}',instructor='${data.instructor}',updatedBy='${data.updatedBy}',updatedAt='${date}' where classId = ${data.classId}`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update Class data`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, update Class data: no record found`
          // );
          return res
            .status(200)
            .json({ success: 0, error: "update Class data: no record found" });
        }
        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, delete Class  by id`);
          //return table data
          let sqlQuery = `SELECT * from class where isActive='true' order by class.title`;
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

  updateSection: (req, res) => {
    const data = req.body;

    console.log(data);
    let sqlQuery = `update sectiongroup set sectionName ='${data.sectionName}' where id = ${data.id}`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update section data`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, update section data: no record found`
          // );
          return res
            .status(200)
            .json({ success: 0, error: "update section data: no record found" });
        }

        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, update section data`);
          return res
            .status(200)
            .json({ success: 1, data: "update section data success" });
        }
      });
    }
    catch (error) {
    }
  },
  updateClassStatus: (req, res) => {
    let sqlQuery = `update class set isActive ='false'`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update Class data`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, update Class data: no record found`
          // );
          return res
            .status(200)
            .json({ success: 0, error: "update class data: no record found" });
        }

        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, update Class data`);
          return res
            .status(200)
            .json({ success: 1, error: "update class data success" });
        }
      });
    }
    catch (error) {
    }
  },

  deleteAllClass: (req, res) => {
    const id = req.body;
    // let sqlQuery = `delete from Class where userId = ${id.Class_id}`;
    let sqlQuery = `delete from class`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete Class by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete Class by  id: no Class record found`
          // );
          return res.status(200).json({
            success: 0,
            error: "delete Class by id: no Class record found",
          });
        }
        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, delete Class  by id`);
          return res.status(200).json({
            success: 1,
            message: "Class deleted successfully",
          });
        }
      });
    }
    catch (error) {
    }
  },
  deleteSingleClass: (req, res) => {
    const id = req.params.classId;
    let sqlQuery = `delete from class where classId = '${id}'`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete Class by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete Class by  id: no Class record found`
          // );
          return res.status(200).json({
            success: 0,
            error: "delete Class by id: no Class record found",
          });
        }
        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, delete Class  by id`);
          //return table data
          let sqlQuery = `SELECT * from class where isActive='true' order by class.title`;
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

  deletesinglegroup: (req, res) => {
    const id = req.params.id;
    let sqlQuery = `delete from sectiongroup where id = '${id}'`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete Class by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete Class by  id: no Class record found`
          // );
          return res.status(200).json({
            success: 0,
            error: "delete Class by id: no Class record found",
          });
        }
        if (result.affectedRows == 1) {
          // logger.info(`${req.method} ${req.originalUrl}, delete Class  by id`);
          //return table data
          let sqlQuery = `select * from sectiongroup `;
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
    let sqlQuery = `truncate table class`;
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

  deleteSectionbyClass: (req, res) => {
    const id = req.body;
    console.log(id);
    let sqlQuery = `delete from section where classId = '${id.class}' and sectionName = '${id.section}'`;

    try {
      pool.query(sqlQuery, (error, result) => {
        console.log(result.affectedRows);
        if (error) {
          // logger.info(
          //   `${req.method} ${req.originalUrl} ${req.sqlQuery},'DB error:'${error.sqlMessage}, delete Class section by id`
          // );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete Class section by  id: no  record found`
          // );
          return res.status(200).json({
            success: 0,
            error: "delete class section by id: no  record found",
          });
        }
        if (result.affectedRows == 1) {
          // logger.info(
          //   `${req.method} ${req.originalUrl}, delete Class section  by id`
          // );
          return res.status(200).json({
            success: 1,
            message: "Class section deleted successfully",
          });
        }
      });
    }
    catch (error) {
    }
  },
};
