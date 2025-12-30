const pool = require("../../config/database.js");
// const logger = require("../../util/logger.js");
var createHash = require("hash-generator");

let date = new Date();
date = date.toLocaleDateString("en-CA");


async function loopfeedatils(split_objects, data) {
  let date = new Date();
  date = date.toLocaleDateString("en-CA");
  console.log(date)
  let check = Number(data.amountpaid)
  let box = []
  for (const x of split_objects) {
    let bb = eval(x.bal - check)
    console.log('check first' + check)
    console.log(x)

    //if fee item already paid, skip loop to next fee item
    if (0 == x.bal) {
      console.log('OPPPPTTIOOONN 3')

      box.push(x.item + '-' + x.paid + '-' + x.paid + '-0')
      continue
    }

    if (check <= 0) {
      console.log('OPPPPTTIOOONN 4')

      box.push(x.item + '-' + x.fee + '-' + x.paid + '-' + x.bal)
      continue
    }

    //  verify wether check > 0 and can cover fully the fee item price
    if ((check > 0) & (check >= x.bal)) {
      console.log('OPPPPTTIOOONN 1')

      const promise10 = await new Promise((resolve, reject) => {
        let sqlQuery = `INSERT INTO feedetails (feeitem,feeamount,amountapportioned,totalfeepaid,balance,stdname,student_id,collectedby,staffid,datecollected,class,classid,session,sessionid,activeaccountid,receiptid,balbeforepay,section) VALUES ('${x.item}','${x.fee}','${x.bal}','${data.amountpaid}','0','${data.name}','${data.id}','${data.collectedby}','${data.staffid}','${date}','${data.class}','${data.classid}','${data.session}','${data.sessionid}','${data.activeaccount}','${data.receiptid}','${x.bal}','${data.section}');`;

        try {
          pool.query(sqlQuery, (error, result) => {
            if (error) {

              console.log(error)
            }
            resolve(result)
            //update check

            box.push(x.item + '-' + x.fee + '-' + x.bal + '-0')

          })
        }
        catch (error) {
        }
      })
    }


    if (check > 0 & check < x.bal & x.paid == 0) {
      console.log('OPPPPTTIOOONN 2')
      let cc = bb < 0 ? 0 : bb
      let jj = x.bal - check
      //do same thing but end loop by not updating counter
      const promise10 = await new Promise((resolve, reject) => {
        let sqlQuery = `INSERT INTO feedetails (feeitem,feeamount,amountapportioned,totalfeepaid,balance,stdname,student_id,collectedby,staffid,datecollected,class,classid,session,sessionid,activeaccountid,receiptid,balbeforepay,section) VALUES ('${x.item}','${x.fee}','${check}','${data.amountpaid}','${Math.abs(jj)}','${data.name}','${data.id}','${data.collectedby}','${data.staffid}','${date}','${data.class}','${data.classid}','${data.session}','${data.sessionid}','${data.activeaccount}','${data.receiptid}','${x.bal}','${data.section}');`;

        try {
          pool.query(sqlQuery, (error, result) => {
            if (error) {

              console.log(error)
            }
            resolve(result)
            box.push(x.item + '-' + x.fee + '-' + check + '-' + jj)


          })
        }
        catch (error) {
        }
      })



      let xx = promise10


    }
    if (check > 0 & check < x.bal & x.paid > 0) {
      console.log('OPPPPTTIOOONN 3')
      let cc = bb < 0 ? 0 : bb
      let jj = x.bal - check

      //do same thing but end loop by not updating counter
      const promise10 = await new Promise((resolve, reject) => {
        let sqlQuery = `INSERT INTO feedetails (feeitem,feeamount,amountapportioned,totalfeepaid,balance,stdname,student_id,collectedby,staffid,datecollected,class,classid,session,sessionid,activeaccountid,receiptid,balbeforepay,section) VALUES ('${x.item}','${x.fee}','${check}','${data.amountpaid}','${Math.abs(jj)}','${data.name}','${data.id}','${data.collectedby}','${data.staffid}','${date}','${data.class}','${data.classid}','${data.session}','${data.sessionid}','${data.activeaccount}','${data.receiptid}','${x.bal}','${data.section}');`;

        try {
          pool.query(sqlQuery, (error, result) => {
            if (error) {

              console.log(error)
            }
            resolve(result)
            box.push(x.item + '-' + x.fee + '-' + check + '-' + jj)


          })
        }
        catch (error) {
        }
      })



      let xx = promise10

      continue

    }

    //  wnen dedections done and money is finished


    console.log('box' + box)


    check = check - x.bal
    console.log('check after' + check)


  }
  return box
}
async function AssignFeeByClass(data) {
  return new Promise(async (resolve2, reject) => {
    let feedata = data;
    console.log(feedata);
    for (const feedatas of feedata) {
      console.log('fee datas isssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')

      console.log(feedata)
      let name = feedatas.name;
      let amt = feedatas.amt;
      let clazz = feedatas.class;
      let cart = feedatas.cart;


      const promise4 = await new Promise((resolve1, reject) => {
        let sqlQuery1 = `select  account.preference,account.student_id from student left join account on student.student_id = account.student_id where student.class ='${clazz}' and student.cartegory ='${cart}' `;

        try {
          pool.query(sqlQuery1, async (error, resultz) => {
            if (error) {
              console.log(
                `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
              );
            }
            let ss = await resultz;

            if (resultz.length == 0) {
              return resolve1("none");
            }

            console.log(ss);
            for (const result of resultz) {
              let singlestudent = result.student_id;
              let preference = result.preference;

              let bb = ss;
              let feedata = data.fee;

              console.log("fee running" + name);

              async function update(name, singlestudent) {
                console.log(singlestudent);
                let sqlQuery2 = `select feepayable as feepay, scholarship from account where student_id='${singlestudent}' `;
                const promise = await new Promise((resolve, reject) => {
                  try {
                    pool.query(sqlQuery2, async (error, resulty) => {
                      if (error) {
                        console.log(
                          `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
                        );
                      }
                      console.log(
                        "feeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee paaaaaaaaaaaaaaaaaaaaaaable"
                      );
                      resolve(resulty);
                    });
                  }
                  catch (error) {
                  }

                });

                const promise1 = await new Promise((resolve, reject) => {
                  console.log(singlestudent);
                  let splitPreference = preference.split(",");
                  if (splitPreference.includes(name)) {
                    resolve(false);
                  } else {
                    resolve(true);
                  }
                });

                let prom = await promise1;
                console.log(promise);

                let val = await promise[0].feepay;
                let scholarship = await promise[0].scholarship;

                let amount = eval(amt + val);

                let sqlQuery6 = `update account set feepayable = '${amount}'  where student_id = '${singlestudent}' `;
                console.log(prom);
                if (prom == true) {
                  console.log("update running" + val);

                  console.log("amount is" + amount);


                  try {
                    pool.query(sqlQuery6, async (error, result) => {
                      if (error) {
                        console.log(
                          `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
                        );
                      }

                      resolve1("done");
                    });
                  }
                  catch (error) {
                  }
                } else {
                  console.log(
                    "faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalllllllllllseeeeeeee"
                  );
                  return reject("done");
                }
              }

              let hh = await update(name, singlestudent);
              console.log(hh)
            }
          });
        }
        catch (error) {
        }
      });
      let set = await promise4;


    }
    // if (i == feedata.length - 1) {
    // ActivityregisterLog(
    //   "Assign Fee",
    //   data.createdby,
    //   "none",
    //   "Applied",
    //   date,
    //   `Assign fee for ${data.class}`,
    //   'set'
    // );

    setTimeout(() => {
      resolve2(true);
    }, 3000);

    // let sqlQuery = `select * from assignfeecartegory order by id desc`;
    // try {
    //      pool.query(sqlQuery, (error, result) => {
    //   res.status(200).json({ success: 1, data: result });
    // });
    // console.log("Fees Assign logged Successfully");
  }




    //}
  );
}

async function recordfeepayment(data) {
  //record payment

  const promise1 = await new Promise((resolve, reject) => {

    let date = new Date();
    console.log(date.toLocaleDateString("en-CA"));
    let sqlQuery = `insert into feepaymentrecords (student_id,activeaccountid,stdname,class,amountpaid,mode,balbeforepayment,balanceafterpayment,date,collectedby,receiptid,arrears,activity,session) values
 ('${data.id}','${data.activeaccount}','${data.name}','${data.class}','${data.amountpaid}','${data.mode
      }','${data.balbeforepayment}','${data.balanceafterpayment
      }','${date.toLocaleDateString("en-CA")}','${data.collectedby}','${data.receiptid
      }','${data.arrears}','Fee Payment','${data.session}')`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(error)
          console.log(
            `${req.method} ${req.originalUrl},'success', fetch all student by class`
          );
        }
        resolve(result)
        // logger.info(
        //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
        // );
      });
    }
    catch (error) {
    }
  });
  return promise1

  // const promise10 = await new Promise((resolve, reject) => {

  //   let date = new Date();
  //   console.log(date.toLocaleDateString("en-CA"));
  //   let sqlQuery = `insert into ${data.activeaccountid} (student_id,name,accountbalance,amountpaid,mode,balbeforepayment,balanceafterpayment,date,collectedby,receiptid,arrears,activity,session) values
  //  ('${data.id}','${data.name}','${data.class}','${data.amountpaid}','${data.mode
  //     }','${data.balbeforepayment}','${data.balanceafterpayment
  //     }','${date.toLocaleDateString("en-CA")}','${data.collectedby}','${data.receiptid
  //     }','${data.arrears}','Fee Payment','${data.session}')`;
  //   try {
  //        pool.query(sqlQuery, (error, result) => {
  //     if (error) {
  //       console.log(
  //         `${req.method} ${req.originalUrl},'success', fetch all student by class`
  //       );
  //     }
  //     resolve(result)

  //     // logger.info(
  //     //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
  //     // );
  //   });
  // });

}

async function update(feedatas, student) {

  //check for preference wether it exist or not
  const promise1 = await new Promise((resolve, reject) => {
    let splitPreference = student.preference.split(",");
    if (splitPreference.includes(feedatas.name)) {
      resolve(false);
    } else {
      resolve(true);
    }
  });

  let prom = await promise1;
  let splitPreference = student.preference.split(",");


  async function checkpref(splitPreference) {

    async function forEachAsync(splitPreference) {
      let subfee = 0

      for (const pref of splitPreference) {

        // if (pref.includes(feedatas.name)) {
        //   console.log('Exempted ' + feedatas.name)
        // } else {
        subfee = subfee + feedatas.amt
        console.log('subfee is' + subfee)
        console.log(subfee)
        console.log(feedatas.name)


        // }

      }
      return subfee
    }




    let kk = await forEachAsync(splitPreference);





    return kk
  }


  let ll = await checkpref(splitPreference)

  console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')

  console.log(ll)

  const promise9 = await new Promise((resolve, reject) => {
    let sqlQuery2 = `select feepayable as currentfeepayable from student where student_id = '${student.student_id}'`
    try {
      pool.query(sqlQuery2, async (error, result) => {
        if (error) {
          console.log(
            `${sqlQuery2} ${req.originalUrl}, 'server error', fetch all fee`
          );
        }

        resolve(result);
      });
    }
    catch (error) {
    }
  });

  let current = await promise9
  console.log(current);
  console.log(feedatas.amt);


  let amount = eval(Number(feedatas.amt) + Number(current[0].currentfeepayable));

  let sqlQuery6 = `update student set feepayable = '${amount}'  where student_id = '${student.student_id}' `;
  console.log(sqlQuery6);

  // if (prom == true) {
  //   console.log("update running" + feedatas.name);

  //   console.log("amount is" + amount);


  //   try {
  //        pool.query(sqlQuery6, async (error, result) => {
  //     if (error) {
  //       console.log(
  //         `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
  //       );
  //     }

  //   });
  // } else {
  //   console.log(
  //     "faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalllllllllllseeeeeeee"
  //   );
  // }
}


async function setfeedetail(feedata, stud) {
  return new Promise(async (resolve2, reject) => {

    console.log('set fee detail called');
    let splitPreference = stud[0].preference.split(",");
    let splitting_array = stud[0].feedetails.split(',')
    let split_objects = splitting_array.map(function (str) {
      let box = str.split('-');
      return { item: box[0], fee: Number(box[1]), paid: Number(box[2]), bal: Number(box[3]) }
    });

    let xx = []
    for (const feedatas of feedata) {

      if (splitPreference.includes(feedatas.name)) {
        console.log('Exempted ' + feedatas.name)
      } else {

        let extract = split_objects.filter((item) => item.item === feedatas.name)
        let val = extract.length == 0 ? 0 : extract[0].bal

        console.log(val)

        let finalamt = feedatas.amt + val
        xx.push(feedatas.name + '-' + feedatas.amt + '-0-' + finalamt)

        // }


      }
    }
    console.log(xx)
    //console.log(xx.toString())

    resolve2(xx.toString());

  }

  );
}
async function setfeedetailAlt(feedata) {
  return new Promise(async (resolve2, reject) => {
    console.log(feedata)

    let xx = []
    for (const feedatas of feedata) {
      xx.push(feedatas.feeitem + '-' + feedatas.amountapportioned + '-' + feedatas.amountpaid + '-' + feedatas.balance)
      // }
    }
    console.log(xx)
    //console.log(xx.toString())

    resolve2(xx.toString());
  }

  );
}
async function AssignFeeByStudent(feedata, stud) {
  return new Promise(async (resolve2, reject) => {

    console.log('assign function called');
    let splitPreference = stud[0].preference.split(",");
    let subfee = 0
    let exemptedfee = 0

    for (const feedatas of feedata) {

      if (splitPreference.includes(feedatas.name)) {
        console.log('Exempted ' + feedatas.name)
        exemptedfee = exemptedfee + feedatas.amt

      } else {
        //   subfee.push(feedatas.amt)
        subfee = subfee + feedatas.amt
        console.log('subfee is' + subfee + feedatas.name)

        // }


      }
    }

    resolve2({ 'subfee': subfee, 'exemptedfee': exemptedfee });

  }

  );
}



async function RecordAssignFee(data) {
  let sqlQuery = `insert into assignfeerecord (class,total,cartegory,createdat,status,createdby) values
     ('${data.class}','${data.total}','${data.scartegory}','${date}','pending','${data.createdby
    }')`;

  try {
    pool.query(sqlQuery, (error, results, fields) => {
      if (error) {
        console.log(error);
        return console.log("assignfeerecord log error");
      }
      console.log("assignfeerecord logged successfully");
    });
  }
  catch (error) {
  }
}
function checkFeeExist(data, callBack) {
  console.log(data)
  let qry = `select * from assignfeecartegory where feename = '${data.name}' and where class = '${data.class}' and where scartegory ='${data.cart}' `
  try {
    pool.query(qry
      ,

      (error, results, fields) => {
        console.log('yyyyyyyyyyyyyyy')
        console.log(results)

        console.log(qry)

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

function checkFeeItemExist(data, callBack) {
  console.log(data)
  let qry = `select * from feesgroup where name = '${data.name}' `
  try {
    pool.query(qry
      ,

      (error, results, fields) => {
        console.log('yyyyyyyyyyyyyyy')
        console.log(results)

        console.log(qry)

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


async function getfee(custom) {
  let Val = []
  let kk = custom.name
  let tt = custom.class
  let uu = custom.cart
  let sqlQuery = `select id from assignfeecartegory where feename = '${kk}' and class = '${tt}' and scartegory = '${uu}' `
  try {
    pool.query(sqlQuery, (error, results, fields) => {
      console.log(sqlQuery);
      console.log(results);
      if (error) {
        console.log(error);
        return console.log(
          " error deleting initial records "
        );
      }
      if (results) {
        val.push()
        resolve(results);
        console.log(results);
        return console.log(
          " the value exist "
        );
      }



    });

    return result
  }
  catch (error) {
  }
}

//function to check
async function generatefeecartchecker(classname) {
  let myArray = []

  const promise2 = await new Promise((resolve, reject) => {

    let sqlQuery = `SELECT distinct(scartegory) as feecount FROM assignfeecartegory WHERE class = '${classname}' `

    try {
      try {
        pool.query(sqlQuery, (error, results, fields) => {
          if (error) {
            console.log(error);
            resolve('false')

            return console.log("assignfeecartegory4 log error --new fee cart");
          }
          resolve(results);

        });
      }
      catch (error) {
      }

    } catch (error) {
    }
    ;
  })

    ;
  const promise1 = await new Promise((resolve, reject) => {

    let sqlQuery = `SELECT distinct(cartegory) as classcount  FROM student WHERE class = '${classname}' `
    try {
      try {
        pool.query(sqlQuery, (error, results, fields) => {
          console.log(sqlQuery)

          if (error) {
            console.log(error);
            resolve('false')

            return console.log();
          }
          resolve(results);

        });

      } catch (error) {
      }
      ;
    }
    catch (error) {
    }
  });



  for (const count of promise1) {
    if (promise2.some(e => e.feecount === count.classcount)) {
    }
    else {
      myArray.push(count.classcount)

      //  return res.status(500)
      //   .json({ success: 0, error: "internal server error", message: error });
    }
  }

  console.log(myArray)

  return myArray

}




// 
//SELECT count(distinct(cartegory)) as classcount,distinct(cartegory) as classcart FROM `student` WHERE class = 'JHS 1'; 

async function CreateAssignFeeClass(data) {

  //clear initial asigned fee record for chosen class(es)
  let cartid = hashgenerator(9)
  const promise = await new Promise((resolve, reject) => {
    for (let i = 0; i < data.fee.length; i++) {

      let sqlQuery = `delete from assignfeecartegory where class = '${data.class}' and scartegory = '${data.scartegory}' `;

      try {
        pool.query(sqlQuery, (error, results, fields) => {
          if (error) {
            console.log(error);
            return console.log(
              " error deleting initial assign fee records "
            );
          }
          resolve(results);
        });
      }
      catch (error) {
      }
    }

  });

  const val = await promise

  console.log(data)
  for (const val of data.fee) {


    const promise2 = await new Promise((resolve, reject) => {
      function setrec(val) {

        console.log(val)

        let name = val[0];
        let amt = val[1];

        let date = new Date();
        date = date.toLocaleDateString("en-CA");
        console.log(date);
        let sqlQuery = `insert into assignfeecartegory (class,scartegory,feename,amount,createdat,createdby,total) values
     ('${data.class}','${data.scartegory}','${name}','${amt}','${date}','${data.createdby}','${data.total}')`;

        try {
          pool.query(sqlQuery, (error, results, fields) => {
            if (error) {
              console.log(error);
              resolve('false')

              return console.log("assignfeecartegory4 log error --new fee cart");
            }
            // resolve(results);
            console.log(
              "assignfeecartegory logged successfully --new fee cart"
            );
          });

        } catch (error) {
        }
        ;
      }
      setTimeout(() => {
        setrec(val)
        resolve(true);

      }, 1000);
    }

    )
    let result = promise2
    console.log(result)


  }

}



function ActivityregisterLog(activity, user, amount, status, date, description) {
  let sqlQuery = `insert into financelog (activity,createdby,amount,createdAt,status,description) values
     ('${activity}','${user}','${amount}','${date}','applied','${description}')`;

  try {
    pool.query(sqlQuery, (error, results, fields) => {
      if (error) {
        console.log(error);
        return console.log("financelog log error");
      }
      console.log("financelog logged successfully");
    });
  }
  catch (error) {
  }
}
function FeeGenerateLog(data, entity, description) {
  let sqlQuery = `insert into feegeneraterecord (code,session,createdby,date,entity,description) values
     ('${data.code}','${data.session}','${data.createdby}','${date}','${entity}','${description}')`;

  try {
    pool.query(sqlQuery, (error, results, fields) => {
      if (error) {
        console.log(error);
        return console.log("financelog log error");
      }
      console.log("financelog logged successfully");
    });
  }
  catch (error) {
  }
}

function UpdateAccountLog(data) {
  let sqlQuery = `insert into accountupdatelog (createdby,createdat,balance,activity,arrears) values
     ('${data.createdby}','${date}','${data.balance}','${data.activity}','${data.arrears}')`;

  try {
    pool.query(sqlQuery, (error, results, fields) => {
      if (error) {
        console.log(error);
        return console.log("Update log error");
      }
      console.log("update  logged successfully");
    });
  }
  catch (error) {
  }
}
function AssignFeeLog(createdby, entity) {
  let sqlQuery = `insert into assignfeelog (createdby,createdat,entity) values
     ('${createdby}','${date}','${entity}')`;

  try {
    pool.query(sqlQuery, (error, results, fields) => {
      if (error) {
        console.log(error);
        return console.log("Assign log error");
      }
      console.log("Assign fee logged successfully");
    });
  }
  catch (error) {
  }
}
async function getfeepayable(stdid, callBack) {
  try {
    pool.query(
      `select feepayable  from account where student_id = '${stdid.student_id}' `,
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        console.log(results);
        return callBack(null, results[0].feepayable);
      }
    );
  }
  catch (error) {
  }
}
async function getFeecart({ stdid, name }, callBack) {
  try {
    pool.query(
      `select ${name} as no from account  where student_id = '${stdid.student_id}' `,

      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0].no);
      }
    );
  }
  catch (error) {
  }
}
async function updatefeepayable({ stdid, amount }, callBack) {
  try {
    pool.query(
      `update account set feepayable = '${amount}'  where student_id = '${stdid.student_id}' `,
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0].no);
      }
    );
  }
  catch (error) {
  }
}
function hashgenerator(num) {
  return createHash(num);
}
module.exports = {
  createfee: async (req, res) => {
    const data = req.body;
    console.log(data);

    function hashgenerator(num) {
      return createHash(num);
    }

    let code = hashgenerator(6);

    let sqlQuery = `insert into fee (itemName,itemId,cartegory,quantity,CreatedBy,supplier,createdAt,supplierContact1,supplierContact2,SupplierInfo,isActive,description) values
 ('${data.itemName}','${code}','${data.cartegory}',${data.quantity},'${data.CreatedBy}','${data.supplier}','${date}','${data.supplierContact1}','${data.supplierContact2}','${data.SupplierInfo}','true','${data.description}')`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create new fee`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows == 1) {
          console.log(`${req.method} ${req.originalUrl},Success create new fee`);
          let sqlQuery = `select * from fee  where isActive = 'true'`;
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
  updatescholarship: async (req, res) => {
    const data = req.body;
    console.log(data);
    let sqlQuery2 = `update scholarshipenroll set scholarshiptitle ='${data.title}',amount = '${data.amount}',cartegorycovering='${data.applicable}' where scholarshipid ='${data.id}'`;

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

    let sqlQuery = `update scholarshiplist set title = '${data.title}',amount = '${data.amount}',createdby='${data.CreatedBy}',createdat='${date}',percent ='${data.percent}',feecartapplicable ='${data.applicable}',applicable ='${data.applicable}',type='${data.type}' where id='${data.id}' `;
    console.log(sqlQuery)
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update scholarship`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        if (result.affectedRows == 1) {
          console.log(
            `${req.method} ${req.originalUrl},Success update scholarship`
          );
          let sqlQuery = `select * from scholarshiplist `;
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




  addScholarship: async (req, res) => {
    const data = req.body;
    console.log(data);

    let sqlQuery = `insert into scholarshiplist (title,amount,CreatedBy,createdAt,percent,applicable,type) values
   ('${data.title}','${data.amount}','${data.Createdby}','${date}','${data.percent}','${data.applicable}','${data.type}')`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create scholarship`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        if (result.affectedRows == 1) {
          console.log(
            `${req.method} ${req.originalUrl},Success create scholarship`
          );
          let sqlQuery = `select * from scholarshiplist `;
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

  enrollScholarship: async (req, res) => {
    const data = req.body;
    console.log(data);

    //delete existing scholardhip for studrnt before inserting 
    const promise8 = await new Promise((resolve, reject) => {

      let sqlQuery3 = `delete from scholarshipenroll where student_id ='${data.id}' `;

      try {
        pool.query(sqlQuery3, (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create enroll scholarship`
            );

          }
          resolve(result)

        });
      }
      catch (error) {
      }
    });
    let bb = promise8
        let sqlQuery = `update student set scholarship = '${data.amount}' where student_id ='${data.id}' `;

    //let sqlQuery = `update student set scholarship = '${data.amount}',feepayable = '${data.feepayable}', accountbalance = '${data.accountbalance}' where student_id ='${data.id}' `;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create enroll scholarship`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        if (result.affectedRows == 1) {
          // res.status(200).json({ success: 1 });
          let sqlQuery = `insert into scholarshipenroll (student_id,scholarshiptitle,scholarshipid,createdat,createdby,amount,cartegorycovering) values
        ('${data.id}','${data.scholarship}','${data.scholarId}','${date}','${data.createdby}','${data.amount}','${data.cover}')`;

          try {
            pool.query(sqlQuery, (error, result) => {
              if (error) {
                console.log(
                  `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, create enroll scholarship`
                );
                console.log(
                  `${req.method} ${req.originalUrl},Success create enroll scholarship`
                );

                return res.status(500).json({
                  success: 0,
                  error: "internal server error",
                  message: error,
                });
              }
              return res.status(200).json({
                success: 1,
              });
            });
          }
          catch (error) {
          }

          // let sqlQuery = `select * from scholarshipenroll `;
          // try {
          // pool.query(sqlQuery, (error, result) => {
          //   res.status(200).json({ success: 1, data: result });
          // });
        }
      });
    }
    catch (error) {
    }

  },
  totalfee: (req, res) => {
    let period = req.body.period
    let session = req.body.session.sessionname

    console.log(session)
    //if (period == 'Current Session') return 

    function getquery(period, session) {
      if (period == 'Current Session') return `select  sum(amountpaid) as total from feepaymentrecords where session = '${session}' `
      if (period == 'Today') return `select  sum(amountpaid) as total from feepaymentrecords where date = '${date}'`

    }
    let sqlQuery = getquery(period, session);
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
          return res.status(200).json({
            success: 1,
            data: [],
          });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getsinglebill: (req, res) => {
    const data = req.body
    let sqlQuery = `select * from assignfeecartegory where assignfeecartegory.scartegory = '${data.cart}' and assignfeecartegory.class = '${data.class}' `;
    console.log(sqlQuery)

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
          return res.status(200).json({
            success: 1,
            data: [],
          });
        }
        console.log(`${result} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getbulkbill: async (req, res) => {
    const data = req.body

    let sqlQuery = `select student_id from student where class = '${data.class}'`;

    const promise8 = await new Promise((resolve, reject) => {
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

          if (result) {
            console.log('student list retrieved');
            resolve(result)
          }
        });
      }
      catch (error) {
      }
    });
    let fetchedStudent = await promise8;
    let myArray = []
    async function forEachAsync(fetchedStudent) {

      for (const val of fetchedStudent) {

        let sqlQuery1 = `select student.*,assignfeecartegory.* from student right join assignfeecartegory on student.cartegory = assignfeecartegory.scartegory  where student.student_id = '${val.student_id}' and assignfeecartegory.class = '${data.class}'`;
        const promise9 = await new Promise((resolve, reject) => {
          try {
            pool.query(sqlQuery1, (error, result) => {
              if (error) {
                console.log(error)
                console.log(
                  `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
                );
                return res
                  .status(500)
                  .json({ success: 0, error: "internal server error", message: error });
              }
              resolve(result)
                ;
            });
          }
          catch (error) {
          }
        });

        myArray.push(promise9)

      }




    }

    async function main(fetchedStudent) {
      await forEachAsync(fetchedStudent);
      res.status(200).json({ success: 1, data: myArray });

    }
    main(fetchedStudent)

  },

  closeaccount: async (req, res) => {
    const data = req.body
    console.log(data)


    // let query = data.active == true ? sqlQuery1 : sqlQuery2;
    let sqlQuery15 = `select oldsession from accountclosure where oldsession ='${data.oldsession}'`;

    //get new session accountid 
    const promise15 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery15, (error, result) => {
          if (error) {
            console.log(error)
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
          resolve(result)
        });
      }
      catch (error) {
      }
    });
    console.log(promise15)
    if (promise15.length != 0) return res.status(200).json({ success: 2, Message: "Account Already Closed For Session", });

    let code = "session_" + createHash(9);
    // // if(data.active == true){
    // let sqlQuery1 = `update session set active ='false'`;
    // let sqlQuery2 = `select count(id) from session'`;

    // let query = data.active == true ? sqlQuery1 : sqlQuery2;
    let sqlQuery10 = `select sessionaccountid from session where sessionname ='${data.newsession}'`;

    //get new session accountid 
    const promise1 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery10, (error, result) => {
          if (error) {
            console.log(error)
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
          resolve(result)
        });
      }
      catch (error) {
      }
    });

    let val = await promise1
    console.log(val)
    console.log('llllllllllllllllllll')

    //update activeaccount session id
    let sqlQuery = `update session set activeaccountid =  '${val[0].sessionaccountid}',activesessionname = '${data.newsession}'`;
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




    //get old session accountid 
    let sqlQuery11 = `select sessionaccountid from session where sessionname ='${data.oldsession}'`;
    const promise5 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery11, (error, result) => {
          if (error) {
            console.log(error)
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
          resolve(result)
        });
      }
      catch (error) {
      }
    });

    let oldsessionid = await promise5
    console.log(oldsessionid)


    // //get old session accountid 
    // let sqlQuery19 = `select sessionaccountid from session where sessionname ='${data.oldsession}'`;
    // const promise9 = await new Promise((resolve, reject) => {
    //   try {
    //      pool.query(sqlQuery19, (error, result) => {
    //     if (error) {
    //       console.log(error)
    //       console.log(
    //         `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
    //       );
    //       return res
    //         .status(500)
    //         .json({ success: 0, error: "internal server error", message: error });
    //     }
    //     console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
    //     resolve(result)
    //   });
    // });


    //check if dtable exist for recordinding session info
    let sqlQuery22 = `SELECT * 
FROM information_schema.tables
WHERE table_schema = 'yes_school_db' 
    AND table_name = '${oldsessionid[0].sessionaccountid}'
LIMIT 1;`;

    const promise22 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery22, async (error, result) => {

          if (error) {
            console.log(error)
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          console.log(result)

          // if table doesnt exist create it
          if (result.length == 0) {
            console.log('table doesnt exist')

            let sqlQuery1 = `CREATE TABLE ${oldsessionid[0].sessionaccountid}  (
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
                if (error) {
                  console.log(error)
                } else {
                  console.log('table created')

                  //duplicate records into custom table
                  let sqlQuery3 = `insert into   ${oldsessionid[0].sessionaccountid} (student_id,firstName,lastName,otherName,class,amountpaid,arrears,session,feepayable,preference,scholarship,accountbalance,date,createdby) select 
              student_id,firstName,lastName,otherName,class,amountpaid,arrears,'${data.oldsession}',feepayable,preference,scholarship,accountbalance,'${date}','${data.createdby}' from student `;
                  console.log(sqlQuery3)
                  const promise = await new Promise((resolve, reject) => {
                    try {
                      pool.query(sqlQuery3, async (error, result) => {
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
                          return res.status(200).json({
                            success: 1,
                            data: [],
                          });
                        }
                        else {
                          // reset amount paid  to 0 for all student in student table 
                          let sqlQuery6 = `update student set  amountpaid=0.00`;

                          try {
                            pool.query(sqlQuery6, (error, result) => {
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
                                return res.status(200).json({
                                  success: 1,
                                  data: [],
                                });
                              }

                            });


                            //record in account closure
                            let sqlQuery4 = `insert into accountclosure (createdby,createdat,oldsession,newsession,activeaccountid) values
                      ('${data.createdby}','${date}','${data.oldsession}','${data.newsession}','${oldsessionid[0].sessionaccountid}')`;
                            const promise = await new Promise((resolve, reject) => {

                              try {
                                pool.query(sqlQuery4, (error, result) => {
                                  if (error) {
                                    console.log('account closure recorded')
                                    console.log(error)

                                  }

                                  return res.status(200).json({
                                    success: 1,
                                    data: [],
                                  });
                                });
                              }
                              catch (error) {
                              }
                            });
                            console.log('account closure recorded')
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
              });
            }
            catch (error) {
            }
          }


          else {

            console.log('table created')

            //duplicate records into custom table
            let sqlQuery3 = `insert into   ${oldsessionid[0].sessionaccountid} (student_id,firstName,lastName,otherName,class,amountpaid,arrears,session,feepayable,preference,scholarship,accountbalance,date,createdby) select 
          student_id,firstName,lastName,otherName,class,amountpaid,arrears,'${data.oldsession}',feepayable,preference,scholarship,accountbalance,'${date}','${data.createdby}' from student `;
            console.log(sqlQuery3)
            const promise = await new Promise((resolve, reject) => {
              try {
                pool.query(sqlQuery3, async (error, result) => {
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

                    return res.status(200).json({
                      success: 1,
                      data: [],
                    });
                  }
                  else {
                    console.log(' records duplicated in session table')

                    // reset amount paid  to 0 for all student in student table 
                    let sqlQuery6 = `update student set  amountpaid=0.00`;

                    try {
                      pool.query(sqlQuery6, (error, result) => {
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
                          return res.status(200).json({
                            success: 1,
                            data: [],
                          });
                        }
                        console.log(' amountpaid updated')

                      });

                      //record in account closure
                      let sqlQuery4 = `insert into accountclosure (createdby,createdat,oldsession,newsession,activeaccountid) values
                      ('${data.createdby}','${date}','${data.oldsession}','${data.newsession}','${oldsessionid[0].sessionaccountid}')`;
                      const promise = await new Promise((resolve, reject) => {

                        try {
                          pool.query(sqlQuery4, (error, result) => {
                            if (error) {
                              console.log('account closure recorded')
                              console.log(error)

                            }
                            return res.status(200).json({
                              success: 1,
                              data: [],
                            });
                          });
                        }
                        catch (error) {
                        }
                      });

                      console.log('account closure recorded')
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
        });
      }
      catch (error) {
      }
    });
  },
  getAllassignlog: (req, res) => {
    const id = req.body.id
    let sqlQuery = `select * from assignfeelog order by id desc limit  30 `;
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
          return res.status(200).json({
            success: 1,
            data: [],
          });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getAssignRecordAction: (req, res) => {
    const id = req.body.id
    let sqlQuery = `select * from assignfeerecord order by id desc limit  100 `;
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
          return res.status(200).json({
            success: 1,
            data: [],
          });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  reoderitems: async (req, res) => {
    const datas = req.body
    let sqlQuery = `truncate feesgroup`;
    const promise8 = await new Promise((resolve, reject) => {
      console.log(sqlQuery)
      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
          }


          resolve(result)
        });
      }
      catch (error) {
      }
    });
    //console.log(datas)
    let students = await promise8
    for (const data of datas.data) {

      console.log(data)


      let sqlQuery = `insert into feesgroup (name,feeid,createdby,createdat,status,description) values
      ('${data.name}','${data.feeid}','${data.createdby}','${data.createdat}','true','${data.description}')`;
      try {
        const promise6 = await new Promise((resolve, reject) => {

          pool.query(sqlQuery, (error, result) => {
            if (error) {
              console.log(
                `${req.method}  ${error.sqlMessage}, ${req.originalUrl}, 'server error', create  fee cartegory`
              );

              return res
                .status(500)
                .json({ success: 0, error: "internal server error", message: error });
            }


            if (result.affectedRows) {
              console.log(`Success create new fee` + `${data.name}`);
              resolve(true)
            }

          });
        });
        let b = promise6

      }
      catch (error) {
      }


    }

    let sqlQuery1 = `select * from feesgroup `;
    try {
      pool.query(sqlQuery1, (error, result) => {
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }

  },
  feespaidsession: async (req, res) => {
    const data = req.body
    let sqlQuery = `select sessionaccountid from session where sessionname = '${data.session}' `;
    const promise8 = await new Promise((resolve, reject) => {
      console.log(sqlQuery)
      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
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
            return res.status(200).json({
              success: 1,
              data: [],
            });
          }
          resolve(result)
        });
      }
      catch (error) {
      }
    });

    let students = await promise8
    console.log(students)
    let db = students[0].sessionaccountid
    let sqlQuery5 = `select * from  ${db} where class = '${data.class}' `;
    console.log(sqlQuery5)
    const promise1 = await new Promise((resolve, reject) => {
      try {
        pool.query(sqlQuery5, (error, result) => {
          if (error) {
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
            return res.status(200).json({
              success: 1,
              data: [],
            });
          }
          res.status(200).json({ success: 1, data: result });
          resolve(result)
        });
      }
      catch (error) {
      }
    });


  },
  sessionacctreport: async (req, res) => {
    const data = req.body
    console.log(data)

    let sqlQuery3 = `select sessionaccountid  from session where sessionname='${data.id}'`;
    const promise3 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery3, async (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl}, 'server error', fetch accountid error`
            );

            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }

          // console.log(result)
          resolve(result)
        })
        return resolve
      }
      catch (error) {
      }
    });
    let acctid = promise3
    console.log(acctid)



    let sqlQuery1 = `select distinct(class.title) as title,id from class order by class.title asc`;
    const promise1 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery1, async (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
            );

            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }

          // console.log(result)
          resolve(result)
        })
        return resolve
      }
      catch (error) {
      }
    });

    let clazz = promise1
    console.log(clazz)

    let subdata = []

    for (const element of clazz) {

      console.log(element)
      let sqlQuery1 = `select sum(amountpaid) as paid, sum(arrears) as arrears, sum(accountbalance) as balance from ${acctid[0].sessionaccountid} where class = '${element.title}'`;
      const promise2 = await new Promise((resolve, reject) => {

        try {
          pool.query(sqlQuery1, (error, result) => {
            console.log(result)
            if (error) {
              console.log(
                `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
              );
              return res
                .status(500)
                .json({ success: 0, error: "internal server error", message: error });
            }


            let subresult = {
              paid: result[0].paid == null ? 0 : result[0].paid,
              arrears: result[0].arrears == null ? 0 : result[0].arrears,
              balance: result[0].balance == null ? 0 : result[0].balance,
              class: element.title,
              class: element.title,

              classid: element.id
            }
            subdata.push(subresult)
            console.log(subresult)


            resolve(result)
          });
        }
        catch (error) {
        }
      });

      // console.log(element)

      // setTimeout(() => {
      //   res.status(200).json({ success: 1, data: arr });
      // }, 3000);

    }

    console.log('subdataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    console.log(subdata)
    let sqlQuery6 = `select sum(amountpaid) as paid, sum(arrears) as arrears, sum(accountbalance) as balance, createdby,date from ${acctid[0].sessionaccountid}`;

    const promise6 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery6, (error, result) => {
          console.log(result)
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
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
    let subdata1 = promise6
    console.log(subdata1)

    // let sqlQuery = `select * from student where class = '${data.class}' `;
    // const promise8 = await new Promise((resolve, reject) => {

    //   try {
    //     pool.query(sqlQuery, (error, result) => {
    //     if (error) {
    //       console.log(
    //         `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
    //       );
    //       return res
    //         .status(500)
    //         .json({ success: 0, error: "internal server error", message: error });
    //     }

    //     if (!result) {
    //       console.log(
    //         `${req.method} ${req.originalUrl}, fetch fee by id: no record found`
    //       );
    //       return res.status(200).json({
    //         success: 1,
    //         data: [],
    //       });
    //     }
    //     resolve(result)
    //   });
    // });

    // let students = promise8
    // let gold = []

    // for (const element of students) {
    //   // console.log(element)
    //   let sqlQuery1 = `select sum(amountpaid) as paid from feepaymentrecords where student_id = '${element.student_id}' and session = '${data.session}'`;
    //   const promise2 = await new Promise((resolve, reject) => {

    //     try {
    //      pool.query(sqlQuery1, (error, result) => {
    //       console.log(result)
    //       if (error) {
    //         console.log(
    //           `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
    //         );
    //         return res
    //           .status(500)
    //           .json({ success: 0, error: "internal server error", message: error });
    //       }

    //       if (!result) {
    //         gold.push({

    //           student_id: element.student_id,
    //           firstName: element.firstName,
    //           lastName: element.lastName,
    //           otherName: element.otherName,
    //           'class': element.class,
    //           cartegory: element.cartegory,
    //           section: element.section,
    //           amountpaid: element.amountpaid,

    //           accountbalance: element.accountbalance,

    //           feepayable: element.feepayable,
    //           scholarship: element.scholarship,
    //           arrears: element.arrears,
    //           preference: element.preference,
    //           feegeneratedate: element.feegeneratedate,
    //           feegeneratecode: element.feegeneratecode,
    //           feepaid: 0
    //         })
    //       }
    //       else {
    //         gold.push({

    //           student_id: element.student_id,
    //           firstName: element.firstName,
    //           lastName: element.lastName,
    //           otherName: element.otherName,
    //           'class': element.class,
    //           cartegory: element.cartegory,
    //           section: element.section,
    //           amountpaid: element.amountpaid,

    //           accountbalance: element.accountbalance,

    //           feepayable: element.feepayable,
    //           scholarship: element.scholarship,
    //           arrears: element.arrears,
    //           preference: element.preference,
    //           feegeneratedate: element.feegeneratedate,
    //           feegeneratecode: element.feegeneratecode,
    //           feepaid: result[0].paid
    //         })
    //       }
    //       resolve(result)
    //     });
    //   });

    // };
    res.status(200).json({ success: 1, data: subdata, info: subdata1, data1: data.id });

    //  console.log(gold)
  },
  sessionaccountrecords: async (req, res) => {
    const data = req.body
    let sqlQuery = `select * from student where class = '${data.class}' `;
    const promise8 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
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
            return res.status(200).json({
              success: 1,
              data: [],
            });
          }
          resolve(result)
        });
      }
      catch (error) {
      }
    });

    let students = promise8
    let gold = []

    for (const element of students) {
      // console.log(element)
      let sqlQuery1 = `select sum(amountpaid) as paid from feepaymentrecords where student_id = '${element.student_id}' and session = '${data.session}'`;
      const promise2 = await new Promise((resolve, reject) => {

        try {
          pool.query(sqlQuery1, (error, result) => {
            console.log(result)
            if (error) {
              console.log(
                `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
              );
              return res
                .status(500)
                .json({ success: 0, error: "internal server error", message: error });
            }

            if (!result) {
              gold.push({

                student_id: element.student_id,
                firstName: element.firstName,
                lastName: element.lastName,
                otherName: element.otherName,
                'class': element.class,
                cartegory: element.cartegory,
                section: element.section,
                amountpaid: element.amountpaid,

                accountbalance: element.accountbalance,

                feepayable: element.feepayable,
                scholarship: element.scholarship,
                arrears: element.arrears,
                preference: element.preference,
                feegeneratedate: element.feegeneratedate,
                feegeneratecode: element.feegeneratecode,
                feepaid: 0
              })
            }
            else {
              gold.push({

                student_id: element.student_id,
                firstName: element.firstName,
                lastName: element.lastName,
                otherName: element.otherName,
                'class': element.class,
                cartegory: element.cartegory,
                section: element.section,
                amountpaid: element.amountpaid,

                accountbalance: element.accountbalance,

                feepayable: element.feepayable,
                scholarship: element.scholarship,
                arrears: element.arrears,
                preference: element.preference,
                feegeneratedate: element.feegeneratedate,
                feegeneratecode: element.feegeneratecode,
                feepaid: result[0].paid
              })
            }
            resolve(result)
          });
        }
        catch (error) {
        }
      });

    };
    res.status(200).json({ success: 1, data: gold });

    console.log(gold)
  },
  getstudentsessionrecord: async (req, res) => {
    const data = req.body


    let sqlQuery3 = `select sessionaccountid  from session where sessionname='${data.session}'`;
    const promise3 = await new Promise((resolve, reject) => {

      try {
        pool.query(sqlQuery3, async (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl}, 'server error', fetch accountid error`
            );

            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }

          // console.log(result)
          resolve(result)
        })
        return resolve
      }
      catch (error) {
      }
    });
    let acctid = promise3[0].sessionaccountid
    console.log()
    let sqlQuery = `select * from feepaymentrecords  where student_id = '${data.id}' and activeaccountid =  '${acctid}'  order by date desc limit  10`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
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
          return res.status(200).json({
            success: 1,
            data: [],
          });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getstudentrecord: (req, res) => {
    const id = req.body.id
    let sqlQuery = `select * from feepaymentrecords where student_id = '${id}'  order by date desc limit  10`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
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
          return res.status(200).json({
            success: 1,
            data: [],
          });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  generatefeerecord: (req, res) => {
    const id = parseInt(req.params.fee_id);
    let sqlQuery = `SELECT * FROM feegeneraterecord order by id desc limit 50 `;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  fetchaccountclosure: (req, res) => {
    const id = parseInt(req.params.fee_id);
    let sqlQuery = `SELECT * FROM accountclosure  order by id desc limit 50`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  defaultreports: (req, res) => {
    let data = req.body

    let sqlQuery = `SELECT * FROM feedetails where datecollected='${data.date}'  order by id desc limit 50`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  reports: (req, res) => {
    let data = req.body
    let date = new Date();
    dateoday = date.toLocaleDateString("en-CA");
    console.log(data)

    let staff1 = data.staff == '-' ? '0:0' : data.staff.split(':')
    console.log(staff1)

    let staff2 = staff1 == 0 ? 0 : staff1[1]
    console.log(staff2)

    let staff = staff2.trim()
    console.log(data)



    if (data.duration == 'Today') {

      function getquery(data) {
        //class
        if (data.class != '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff == '-') return `select * from feedetails where class='${data.class}'  and datecollected='${dateoday}' order by id desc`


        //class/section/feetype
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and datecollected='${dateoday}' order by id desc`

        //all
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and section='${data.section}' and staffid='${staff}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and datecollected='${dateoday}' and staffid='${staff}' order by id desc`

        //feetype
        if (data.class == '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where feeitem='${data.feetype}'  and datecollected='${dateoday}' order by id desc`

        //class/feetype/collected by
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and staffid='${staff}' and datecollected='${dateoday}' order by id desc`

        //collectected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where  staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}'  and datecollected='${dateoday}' order by id desc`

        //feetype/collected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where  feeitem='${data.feetype}' and staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where  feeitem='${data.feetype}'  and staffid='${staff}' and datecollected='${dateoday}' order by id desc`

        //class/collectected by
        if (data.class != '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}' and class='${data.class}' and datecollected='${dateoday}' order by id desc`

        //collectected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where  staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}' and  and datecollected='${dateoday}' order by id desc`

      }


      let query = getquery(data)
      console.log(query)

      try {
        pool.query(query, (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
          res.status(200).json({ success: 1, data: result });
        });
      }
      catch (error) {
      }
    }
    if (data.duration == 'Custom Period') {
      function getquery(data) {
        //class
        if (data.class != '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and section='${data.section}' and datecollected between '${data.startdate}' and '${data.enddate}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff == '-') return `select * from feedetails where class='${data.class}'  and datecollected='${dateoday}' order by id desc`


        //class/section/feetype
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and datecollected='${dateoday}' order by id desc`

        //all
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and section='${data.section}' and staffid='${staff}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and datecollected='${dateoday}' and staffid='${staff}' order by id desc`

        //feetype
        if (data.class == '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where feeitem='${data.feetype}'  and datecollected='${dateoday}' order by id desc`

        //class/feetype/collected by
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and staffid='${staff}' and datecollected='${dateoday}' order by id desc`

        //collectected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where  staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}'  and datecollected='${dateoday}' order by id desc`

        //feetype/collected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where  feeitem='${data.feetype}' and staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where  feeitem='${data.feetype}'  and staffid='${staff}' and datecollected='${dateoday}' order by id desc`

        //class/collectected by
        if (data.class != '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}' and class='${data.class}' and datecollected='${dateoday}' order by id desc`

        //collectected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where  staffid='${staff}' and section='${data.section}' and datecollected='${dateoday}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}' and  and datecollected='${dateoday}' order by id desc`

      }


      let query = getquery(data)
      console.log(query)
      try {
        pool.query(query, (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
          res.status(200).json({ success: 1, data: result });
        });
      }
      catch (error) {
      }
    }
    if (data.duration == 'Current Session') {
      function getquery(data) {
        //class
        if (data.class != '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and section='${data.section}' and sessionid='${data.sessionid}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff == '-') return `select * from feedetails where class='${data.class}'  and sessionid='${data.sessionid}' order by id desc`


        //class/section/feetype
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and section='${data.section}' and sessionid='${data.sessionid}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and sessionid='${data.sessionid}' order by id desc`

        //all
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and section='${data.section}' and staffid='${staff}' and sessionid='${data.sessionid}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and sessionid='${data.sessionid}' and staffid='${staff}' order by id desc`

        //feetype
        if (data.class == '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff == '-') return `select * from feedetails where feeitem='${data.feetype}'  and sessionid='${data.sessionid}' order by id desc`

        //class/feetype/collected by
        if (data.class != '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}' and staffid='${staff}' and section='${data.section}' and session='${dateoday}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and feeitem='${data.feetype}'  and staffid='${staff}' and sessionid='${data.sessionid}' order by id desc`

        //collectected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where  staffid='${staff}' and section='${data.section}' and sessionid='${data.sessionid}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}'  and sessionid='${data.sessionid}' order by id desc`

        //feetype/collected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where  feeitem='${data.feetype}' and staffid='${staff}' and section='${data.section}' and sessionid='${data.sessionid}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype != '-' & data.staff != '-') return `select * from feedetails where  feeitem='${data.feetype}'  and staffid='${staff}' and sessionid='${data.sessionid}' order by id desc`

        //class/collectected by
        if (data.class != '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where class='${data.class}' and staffid='${staff}' and section='${data.section}' and sessionid='${data.sessionid}' order by id desc`

        if (data.class != '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}' and class='${data.class}' and sessionid='${data.sessionid}' order by id desc`

        //collectected by
        if (data.class == '-' & data.section != 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where  staffid='${staff}' and section='${data.section}' and sessionid='${data.sessionid}' order by id desc`

        if (data.class == '-' & data.section == 'All Sections' & data.feetype == '-' & data.staff != '-') return `select * from feedetails where staffid='${staff}' and  and sessionid='${data.sessionid}' order by id desc`

      }


      let query = getquery(data)
      console.log(query)

      try {
        pool.query(query, (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
            );
            return res
              .status(500)
              .json({ success: 0, error: "internal server error", message: error });
          }
          console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
          res.status(200).json({ success: 1, data: result });
        });
      }
      catch (error) {
      }
    }





  },
  fetchaccountUpdate: (req, res) => {
    const id = parseInt(req.params.fee_id);
    let sqlQuery = `SELECT * FROM accountupdatelog  order by id desc limit 50`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getfeeById: (req, res) => {
    const id = parseInt(req.params.fee_id);
    let sqlQuery = `select * from fee where fee_id = ${id}`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
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
          return res.status(200).json({
            success: 1,
            error: "fetch fee by id: no record found",
          });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  resetclassaccount: async (req, res) => {
    let data = req.body;
    console.log(data);
    const promise8 = await new Promise((resolve, reject) => {
      let sqlQuery = `select student_id from student where class in (${data.class}) `;
      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }
          console.log(result);
          resolve(result);
        });
      }
      catch (error) {
      }
    });
    let fetchedStudent = await promise8;

    const promise2 = await new Promise((resolve, reject) => {
      let info = fetchedStudent;
      console.log(info);
      if (fetchedStudent.length == 0) {
        res.status(200).json({ success: 2, message: "Class Has No Student" });
      }
      for (let i = 0; i < info.length; i++) {
        let sdtID = info[i].student_id;

        let sqlQuery6 = data.type == 'custom' ? `update student set accountbalance = '${data.amount}' where student_id = '${sdtID}'` : `update student set accountbalance = '0',arrears='0',feepayable ='0',amountpaid ='0' where student_id = '${sdtID}'`;;

        async function resetfeepayable(sqlQuery6) {
          const promise3 = await new Promise((resolve, reject) => {
            try {
              pool.query(sqlQuery6, async (error, result) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({
                    success: 1,
                    message: "Internal server",
                    error: error,
                  });
                }
                return resolve(result);
              });
            }
            catch (error) {
            }
          });

          return promise3;
        }

        let gg = resetfeepayable(sqlQuery6);

        if (i == info.length - 1) {
          resolve(gg);
          let val = {
            createdby: data.createdby,
            createdat: date,
            activity: data.type == 'custom' ? 'Update Class(es) account bal' : 'Reset class(es) Account to ) bal',
            balance: data.amount,
            arrears: '-'

          }
          UpdateAccountLog(val)
          res
            .status(200)
            .json({ success: 1, message: "All Accounts Updated successfully" });

          console.log("done updating Selected Class Account bal");
        }
      }
    });

    let arrearsduplicate = promise2;
  },

  resetallaccount: (req, res) => {
    let data = req.body;
    console.log(data);
    let sqlQuery = `update student set accountbalance ='${data.amount}'`;
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

        console.log(
          `${req.method} ${req.originalUrl},'success', reset all account`
        );

        let val = {
          createdby: data.createdby,
          createdat: date,
          activity: 'Update All Students Account Bal',
          balance: data.amount,
          arrears: '-'

        }


        UpdateAccountLog(val)
        res
          .status(200)
          .json({ success: 1, message: "All Accounts Updated successfully" });
      });
    }
    catch (error) {
    }
  },

  updatefeerecord: (req, res) => {
    let data = req.body;
    let sqlQuery = `update assignfeerecord set status = "Applied" where class='${data.class}'`;
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
  getAllfee: (req, res) => {
    let sqlQuery = `select * from fee  where isActive = 'true'`;
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
  getfeerecordgroup: (req, res) => {
    //let sqlQuery = `select DISTINCT(class.title), assignfeecartegory.* from class left join assignfeecartegory on class.title = assignfeecartegory.class group by class.title`;
    let sqlQuery = ` SELECT * FROM assignfeecartegory group by class,scartegory`;
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
  getfeerecord: (req, res) => {
    //  let sqlQuery = `select DISTINCT(class.title), assignfeecartegory.* from class left join assignfeecartegory on class.title = assignfeecartegory.class`;
    let sqlQuery = ` SELECT * FROM assignfeecartegory group by class,scartegory`;

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
  getallassignedfeerecord: async (req, res) => {
    let arr = []

    let sqlQuery = `select distinct(class.title) as title from class`;
    try {
      pool.query(sqlQuery, async (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        // console.log(result)
        async function getcart() {
          let sqlQuery1 = `select title from studentscartegory`;
          const promise5 = await new Promise((resolve, reject) => {
            try {
              pool.query(sqlQuery1, (error, resultz) => {
                if (error) {
                  console.log(
                    `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
                  );

                  return res
                    .status(500)
                    .json({ success: 0, error: "internal server error", message: error });
                }

                console.log(`${req.method} ${req.originalUrl},'success', fetch all fee`);


                resolve(resultz)
                //  res.status(200).json({ success: 1, data: result });
              });
            }
            catch (error) {
            }
          });

          return promise5
        }
        async function getdata(data, cart) {
          let sqlQuery1 = `select * from assignfeecartegory  where class = '${data}' and scartegory = '${cart}'`;
          const promise5 = await new Promise((resolve, reject) => {
            try {
              pool.query(sqlQuery1, (error, resultz) => {
                if (error) {
                  console.log(
                    `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
                  );

                  return res
                    .status(500)
                    .json({ success: 0, error: "internal server error", message: error });
                }

                console.log(`${req.method} ${req.originalUrl},'success', fetch all fee`);


                resolve(resultz)
                //  res.status(200).json({ success: 1, data: result });
              });
            }
            catch (error) {
            }
          });

          return promise5
        }

        let cart = await getcart()


        for (const element of result) {
          // console.log(element)
          let gold = []
          for (let i = 0; i < cart.length; i++) {


            let val = await getdata(element.title, cart[i].title)
            val.length == 0 ? gold.push([{ class: element.title, scartegory: cart[i].title }]) : gold.push(val)
            console.log(val)

            //  console.log(cart.length,cart.indexOf(elementz.title))
            setTimeout(() => {

              if (cart.length == i + 1) {
                arr.push(gold)
                gold = []
              }
            }, 500);

          }

        };




        console.log(arr)
        setTimeout(() => {
          res.status(200).json({ success: 1, data: arr });
        }, 3000);

      });
    }
    catch (error) {
    }


  },

  getAssigncustom: (req, res) => {
    let data = req.body;
    let sqlQuery = `select * from assignfeecartegory where class ='${data.class}'`;
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

        console.log(
          `${req.method} ${req.originalUrl},'success', fetch all assigned fee`
        );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  getAssignfeerecord: (req, res) => {
    let sqlQuery = `select * from assignfeecartegory order by id desc`;
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

        console.log(
          `${req.method} ${req.originalUrl},'success', fetch all assigned fee`
        );

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  paymentWithscholarship: async (req, res) => {
    let id = req.body.id
    // const promise1 = await new Promise((resolve, reject) => {

    //   let sqlQuery = `select * from feepaymentrecords where student_id='${id}' limit 15 `;
    //   try {
    //     pool.query(sqlQuery, (error, result) => {
    //     if (error) {
    //       console.log(
    //         `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
    //       );

    //       return res
    //         .status(500)
    //         .json({ success: 0, error: "internal server error", message: error });
    //     }

    //     console.log(`${req.method} ${req.originalUrl},'success', fetch all fee`);
    //     resolve(result)
    //    // res.status(200).json({ success: 1, data: result });
    //   });
    // });

    // let feedata = await promise1

    let sqlQuery1 = `select * from scholarshipenroll where student_id='${id}' `;
    try {
      pool.query(sqlQuery1, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl}, 'server error', fetch all fee`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${req.method} ${req.originalUrl},'success', fetch all fee`);

        // res.status(200).json({ success: 1, scholarship: result , feedata:feedata });
        res.status(200).json({ success: 1, scholarship: result });

      });
    }
    catch (error) {
    }

  },
  getPaymentRecords: (req, res) => {
    let sqlQuery = `select feepaymentrecords.*, student.firstName, student.otherName, student.lastName ,student.class from feepaymentrecords left join student on feepaymentrecords.student_id = student.student_id order by id desc `;
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
  currentopenedaccount: (req, res) => {
    let sqlQuery = `select * from accountclosure order by id desc limit 1`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl}, 'server error',fetch Current Account details`
          );

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(`${req.method} ${req.originalUrl},'success', fetch Current Account details`);

        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },
  getScholarship: (req, res) => {
    let sqlQuery = `select * from scholarshiplist`;
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
  revokeScholarship: (req, res) => {
    let data = req.body;

    let sqlQuery = `Delete  from scholarshipenroll where id = '${data.id}'`;
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

        console.log(
          `${req.method} ${req.originalUrl},'success', 'revoked scholarship`
        );
        if (result.affectedRows) {

          let sqlQuery = `update student set scholarship = 0 where student_id ='${data.id}' `;
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

              let sqlQuery = `select scholarshipenroll.*, student.class, student.firstName,student.lastName, student.otherName from scholarshipenroll left join student on scholarshipenroll.student_id = student.student_id`;

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


  clearlog: async (req, res) => {
    let data = req.body;
    console.log(data)
    async function query(data) {
      if (data.log == "assignfee") {

        return `Truncate Table assignfeelog`;
      }
      if (data.log == "generatefee") {
        return `Truncate Table feegeneraterecord`;
      }
      if (data.log == "accountclosure") {
        return `Truncate Table accountclosure`;

      }
      if (data.log == "accountupdate") {
        return `Truncate Table accountupdatelog`;

      }
    }

    try {
      pool.query(await query(data), async (error, result) => {
        if (error) {
          console.log(`${req.method} ${error}, 'server error', fetch all fee`);
          console.log(error)
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(
          `${req.method} ${req.originalUrl},'success', fetch scholarship list`
        );
        let sqlQuery = `insert into clearlog (createdby,createdat,activity) values
      ('${data.createdBy}','${date}','${data.log}')`;
        try {
          pool.query(sqlQuery, (error, result) => {
            console.log(result);
            res.status(200).json({ success: 1, });
          });
        }
        catch (error) {
        }
      });
    }
    catch (error) {
    }

  },
  getclearlog: (req, res) => {
    const id = parseInt(req.params.fee_id);
    let sqlQuery = `SELECT * FROM clearlog  order by id desc limit 50`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, fetch fee by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        console.log(`${req.method} ${req.originalUrl}, fetch fee by id`);
        res.status(200).json({ success: 1, data: result });
      });
    }
    catch (error) {
    }
  },

  totalfeebyclassreport: async (req, res) => {

    let data = req.body;
    console.log(data)

    const promise5 = await new Promise((resolve, reject) => {
      let sqlQuery = `select DISTINCT feeitem,sum(amountapportioned) as amount from feedetails where sessionid='${data.sessionid}' group by feeitem `;
      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)
          if (error) {
            console.log(error)
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }

          resolve(result);
        });
      }
      catch (error) {
      }
    });

    const promise6 = await new Promise((resolve, reject) => {
      let sqlQuery = `select class,section,feeitem,sum(amountapportioned) as amount from feedetails where sessionid='${data.sessionid}' group by class,section,feeitem  ;`;
      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)
          if (error) {
            console.log(error)
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }

          resolve(result);
        });
      }
      catch (error) {
      }
    });


    const promise4 = await new Promise((resolve, reject) => {
      let sqlQuery = `select sum(amountpaid) as totalpaid, sum(feepayable) as totalfpayable, sum(arrears) as totalarears, sum(preferenceamount) as prefamount, sum(scholarship) as shol from student`;
      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)
          if (error) {
            console.log(error)
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }

          resolve(result);
        });
      }
      catch (error) {
      }
    });

    async function query(data) {
      if (true) {

        return `SELECT class, section,sum(feepayable) as payable,sum(scholarship) as scholar,sum(amountpaid) as paid, sum(preferenceamount) as pref,sum(arrears) as arrears,sum(accountbalance) as acctbal FROM student GROUP by class,section;
`;
      } else {
        console.log("custom");
        return `select scholarshipenroll.*, student.class,  student.firstName,student.lastName, student.otherName from scholarshipenroll left join student on scholarshipenroll.student_id = student.student_id where student.class = '${data.class}'`;
      }
    }

    try {
      pool.query(await query(data), (error, result) => {
        if (error) {
          console.log(`${req.method} ${error}, 'server error', fetch all fee`);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(
          `${req.method} ${req.originalUrl},'success', fetch fee records`
        );
        console.log(result);
        res.status(200).json({ success: 1, data: result, result: promise4, result1: promise5, result2: promise6 });
      });
    }
    catch (error) {
    }
  },
  totalfeereport: async (req, res) => {

    let data = req.body;
    let sqlQuery3 = `select sum(amountapportioned) as amount from feedetails where datecollected='${date}'`;
    let sqlQuery4 = `select sum(amountapportioned) as amount from feedetails where datecollected between '${data.startdate}' and '${data.enddate}'`;
    let sqlQuery5 = `select sum(amountapportioned) as amount from feedetails where sessionid='${data.sessionid}'`;

    function getquery1(duration) {

      if (duration == 'Today') return sqlQuery3
      if (duration == 'Custom Period') return sqlQuery4
      if (duration == 'Current Session') return sqlQuery5
    }
    console.log(data)
    const promise4 = await new Promise((resolve, reject) => {
      try {
        pool.query(getquery1(data.duration), (error, result) => {
          console.log(result)
          if (error) {
            console.log(error)
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }

          resolve(result)
        });
      }
      catch (error) {
      }
    })

    let sqlQuery = `select DISTINCT feeitem,sum(amountapportioned) as amount from feedetails where datecollected='${date}' group by feeitem `;
    let sqlQuery1 = `select DISTINCT feeitem,sum(amountapportioned) as amount from feedetails where datecollected between '${data.startdate}' and '${data.enddate}'  group by feeitem `;
    let sqlQuery2 = `select DISTINCT feeitem,sum(amountapportioned) as amount from feedetails where sessionid='${data.sessionid}' group by feeitem `;

    function getquery(duration) {

      if (duration == 'Today') return sqlQuery
      if (duration == 'Custom Period') return sqlQuery1
      if (duration == 'Current Session') return sqlQuery2
    }


    try {
      pool.query(getquery(data.duration), (error, result) => {
        console.log(result)
        if (error) {
          console.log(error)
          return res.status(500).json({
            success: 0,
            error: "internal server error",
            message: error,
          });
        }

        res.status(200).json({ success: 1, data: result,result: promise4, });
      });
    }
    catch (error) {
    }

  },
  getScholarshipEnroll: async (req, res) => {
    let data = req.body;

    async function query(data) {
      if (data.type == "All") {
        console.log("all");

        return `select scholarshipenroll.*, student.class, student.firstName,student.lastName, student.otherName from scholarshipenroll left join student on scholarshipenroll.student_id = student.student_id`;
      } else {
        console.log("custom");
        return `select scholarshipenroll.*, student.class,  student.firstName,student.lastName, student.otherName from scholarshipenroll left join student on scholarshipenroll.student_id = student.student_id where student.class = '${data.class}'`;
      }
    }

    try {
      pool.query(await query(data), (error, result) => {
        if (error) {
          console.log(`${req.method} ${error}, 'server error', fetch all fee`);

          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        console.log(
          `${req.method} ${req.originalUrl},'success', fetch scholarship list`
        );
        console.log(result);
        res.status(200).json({ success: 1, data: result, type: data.type });
      });
    }
    catch (error) {
    }
  },

  createfeeCartegory: (req, res) => {
    const data = req.body;
    let hash = hashgenerator(7);
    console.log(data);

    checkFeeItemExist(data, (err, results) => {
      if (results) {
        console.log("Create new fee exists");
        return res.status(200).json({
          success: 0,
          data: null,
          message: "Fee Name already Exists",
        });
      } else {

        let sqlQuery = `insert into feesgroup (name,feeid,createdby,createdat,status,description) values
    ('${data.name}','${hash}','${data.createdby}','${date}','true','${data.description}')`;
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
            if (result.affectedRows) {
              console.log(`${req.method} ${req.originalUrl},Success create new fee`);

              console.log(
                `${req.method} ${req.originalUrl},Success create new column field`
              );
              let sqlQuery = `select * from feesgroup  where isActive = 'true'`;
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
    })




  },
  getCart: (req, res) => {
    let sqlQuery = `select * from feesgroup`;
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
  updatefee: (req, res) => {
    const data = req.body;

    let sqlQuery = `update fee set itemName ='${data.itemName}',cartegory='${data.cartegory}',quantity='${data.quantity}',description='${data.description}',CreatedBy='${data.CreatedBy}',supplier='${data.supplier}',supplierContact1='${data.supplierContact1}',supplierContact2='${data.supplierContact2}',SupplierInfo='${data.SupplierInfo}' where id = ${data.id}`;

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
          console.log(`${req.method} ${req.originalUrl}, update fee data`);
          return res
            .status(200)
            .json({ success: 1, Message: "update fee data success" });
        }
      });
    }
    catch (error) {
    }
  },
  updatefeecart: async (req, res) => {
    const data = req.body;

  let sqlQuery2 = `update assignfeecartegory set feename ='${data.name}' where feename ='${data.formertitle}'`;
    let sqlQuery3 = `update feedetails set feeitem ='${data.name}' where feeitem ='${data.formertitle}'`;

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
    let sqlQuery = `update feesgroup set name ='${data.name}',description='${data.description}',CreatedBy='${data.CreatedBy}',createdat='${date}' where id = ${data.id}`;

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
          let sqlQuery = `select * from feesgroup`;
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
  generatefeeallstudent: async (req, res) => {
    const data = req.body;
    console.log(data);
    let code = 0

    //get all distinct classnames 
    const promise4 = await new Promise((resolve, reject) => {
      let sqlQuery = `select distinct(class.title) as class from class `;
      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)
          if (error) {
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }
          if (result.length == 0) {
            return res.status(200).json({
              success: 2,
              data: [],
              // error: "internal server error",
              message: 'No Classes Available',
            });
          }
          console.log(result);
          resolve(result);
        });
      }
      catch (error) {
      }
    });

    let clazz = await promise4
    async function checkallclasscart(classes) {
      let final = []
      console.log(classes)
      for (const clazz of classes) {

        let bb = await generatefeecartchecker(clazz.class)

        if (bb.length != 0) {
          final.push({ class: clazz.class, cart: bb })
        }

      };
      return final
    }
    let vv = await checkallclasscart(clazz)


    //break from here if unassigned fees caugthby abouve function
    if (vv.length != 0) return res.status(200).json({ success: 2, message: "Unassigned Fees Detected", data: vv });


    //get all student to be applied to
    const promise8 = await new Promise((resolve, reject) => {
      let sqlQuery = `select student_id from student where  student.isActive = 'true'; `;
      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)
          if (error) {
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }
          if (result.length == 0) {
            return res.status(200).json({
              success: 2,
              data: [],
              // error: "internal server error",
              message: 'No Student In Class',
            });
          }
          console.log(result);
          resolve(result);
        });
      }
      catch (error) {
      }
    });
    let getstudent = promise8;


    for (const stud of getstudent) {
      console.log(stud);

      const promise5 = await new Promise((resolve, reject) => {
        let sqlQuery = `select * from student where student_id = '${stud.student_id}'`;
        try {
          pool.query(sqlQuery, (error, result) => {
            if (error) {
              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            }
            console.log(result);
            resolve(result);
          });
        }
        catch (error) {
        }
      });
      let student = await promise5;
      console.log(student);


      //check for assigned fee for chosen classes and get assigned fee
      const promise3 = await new Promise((resolve, reject) => {
        let sqlQuery = `select class, amount as amt , feename as name,scartegory as cart from assignfeecartegory where class = '${student[0].class}' and scartegory ='${student[0].cartegory}' `;
        try {
          pool.query(sqlQuery, (error, result) => {
            console.log(result)
            console.log(sqlQuery)

            if (error) {
              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            }
            if (result.length == 0) {
              return res.status(200).json({
                success: 3,
                data: [],
                // error: "internal server error",
                message: "No Assigned Fee For Student's Class",
              });
            }
            console.log(result);
            resolve(result);
          });
        }
        catch (error) {
        }
      });
      let getassignedfee = promise3;


      //check preference and fee cart to set feepayable
      let assign = await AssignFeeByStudent(getassignedfee, student);
      console.log("assign is");
      console.log(assign);




      let feedetails = await setfeedetail(getassignedfee, student)
      console.log("feedetails is");

      console.log(feedetails);

      async function generateFee(id, info, assign, feedetails) {

        let scholarship = info[0].scholarship;
        let value = eval(assign.subfee - info[0].scholarship);

        let bal = info[0].accountbalance;




        let amount = eval(
          parseFloat(bal) + parseFloat(value)
        );
        console.log("amount");
        console.log(amount);

        let sqlQuery6 = `update student set arrears = '${bal}', accountbalance ='${amount}',feegeneratecode  ='${code}', feegeneratedate = '${date}', feegenerateforsession = '${data.session}',feepayable = '${value}',preferenceamount = '${assign.exemptedfee}',feedetails = '${feedetails}' where student_id = '${id}'`;

        const promise2 = await new Promise((resolve, reject) => {
          console.log(sqlQuery6)
          try {
            pool.query(sqlQuery6, async (error, result) => {
              if (error) {
                console.log(error);
                res
                  .status(500)
                  .json({ success: 1, message: "Internal server", error: error });
              }
              resolve(result);
            });
          }
          catch (error) {
          }
        });
      }

      //generate fee from values set
      generateFee(student[0].student_id, student, assign, feedetails);

    }
    //register in log
    FeeGenerateLog(data, 'All Students', 'All Classes')
    //  backup account data
    // const promise5 = await new Promise((resolve, reject) => {
    //   let sqlQuery = `SHOW TABLES LIKE '${data.prev}'`;
    //   try {
    //      pool.query(sqlQuery, (error, result) => {
    //     if (error) {
    //       return res.status(500).json({
    //         success: 0,
    //         error: "internal server error",
    //         message: error,
    //       });
    //     }
    //     if (!result) {

    //     } else {

    //     }

    //   });
    // });

    res
      .status(200)
      .json({ success: 1, message: "Fees Generated Successfully", data: clazz });


  },

  generatefeebystudent: async (req, res) => {
    const data = req.body;
    console.log(data);
    let code = hashgenerator(7)
    //get student data
    const promise5 = await new Promise((resolve, reject) => {
      let sqlQuery = `select * from student where student_id = '${data.id}'`;
      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }
          console.log(result);
          resolve(result);
        });
      }
      catch (error) {
      }
    });
    let student = await promise5;

    //check for assigned fee for chosen classes and get assigned fee
    const promise3 = await new Promise((resolve, reject) => {
      let sqlQuery = `select class, amount as amt , feename as name,scartegory as cart from assignfeecartegory where class = '${data.class}' and scartegory ='${data.cartegory}' `;
      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)
          console.log(sqlQuery)

          if (error) {
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }
          if (result.length == 0) {
            return res.status(200).json({
              success: 2, message: "Unassigned Fees Detected", data: [{ class: data.class, cart: data.cartegory }]

            });
          }
          console.log(result);
          resolve(result);
        });
      }
      catch (error) {
      }
    });
    let getassignedfee = promise3;


    //check preference and fee cart to set feepayable
    let assign = await AssignFeeByStudent(getassignedfee, student);
    console.log("assign is");
    console.log(assign);

    let feedetails = await setfeedetail(getassignedfee, student)
    console.log("feedetails is");

    console.log(feedetails);

    async function generateFee(id, info, assign, feedetails) {


      let scholarship = info[0].scholarship;
      let value = eval(assign.subfee - info[0].scholarship);

      let bal = info[0].accountbalance;
      let arrears = info[0].arrears;


      console.log('bala' + bal)
      console.log('assing ' + value)
      console.log('scholarship' + scholarship)
      console.log('arrears' + arrears)
      console.log()

      let amount = eval(
        parseFloat(bal) + parseFloat(value)
      );
      console.log("amount");
      console.log(amount);


      let sqlQuery6 = `update student set arrears = '${bal}', accountbalance ='${amount}',feegeneratecode  ='${code}', feegeneratedate = '${date}', feegenerateforsession = '${data.session}',feepayable = '${value}',preferenceamount = '${assign.exemptedfee}',feedetails='${feedetails}' where student_id = '${id}'`;

      const promise2 = await new Promise((resolve, reject) => {
        console.log(sqlQuery6)
        try {
          pool.query(sqlQuery6, async (error, result) => {
            if (error) {
              console.log(error);
              res
                .status(500)
                .json({ success: 1, message: "Internal server", error: error });
            }
            resolve(result);
            // ActivityregisterLog(
            //   "Generate Fee",
            //   data.createdby,
            //   "none",
            //   "Applied",
            //   date,
            //   "Generating fee for all Classes"
            // );
            FeeGenerateLog(data, 'Single Student', id)
            res
              .status(200)
              .json({ success: 7, message: "Fees Generated Successfully" });
          });
        }
        catch (error) {
        }
      });
    }

    //generate fee from values set
    generateFee(data.id, student, assign, feedetails);

  },





  generatefeebyclass: async (req, res) => {
    const data = req.body;
    console.log(data.class);
    let code = 0
    // let bb = await generatefeecartchecker(data.class)

    async function checkallclasscart(classes) {
      let final = []
      console.log(classes)
      for (const clazz of classes) {

        let bb = await generatefeecartchecker(clazz)

        if (bb.length != 0) {
          final.push({ class: clazz, cart: bb })
        }

      };
      return final
    }
    let vv = await checkallclasscart(data.clazz)


    //break from here if unassigned fees caugthby abouve function
    if (vv.length != 0) return res.status(200).json({ success: 2, message: "Unassigned Fees Detected", data: vv });




    //get all student to be applied to
    const promise8 = await new Promise((resolve, reject) => {
      let sqlQuery = `select student_id from student where class in (${data.class}) and student.isActive = 'true'; `;

      try {
        pool.query(sqlQuery, (error, result) => {
          console.log(result)

          if (error) {
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }
          // if (result.length == 0) {
          //   return res.status(200).json({
          //     success: 2,
          //     data: [],
          //     // error: "internal server error",
          //     message: 'No Student In Class',
          //   });
          // }
          resolve(result);
        });
      }
      catch (error) {
      }
    });
    let getstudent = promise8;


    for (const stud of getstudent) {
      console.log(stud);

      const promise5 = await new Promise((resolve, reject) => {
        let sqlQuery = `select * from student where student_id = '${stud.student_id}'`;
        try {
          pool.query(sqlQuery, (error, result) => {
            if (error) {
              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            }
            console.log(result);
            resolve(result);
          });
        }
        catch (error) {
        }
      });
      let student = await promise5;
      console.log(student);


      //check for assigned fee for chosen classes and get assigned fee
      const promise3 = await new Promise((resolve, reject) => {
        let sqlQuery = `select class, amount as amt , feename as name,scartegory as cart from assignfeecartegory where class = '${student[0].class}' and scartegory ='${student[0].cartegory}' `;
        try {
          pool.query(sqlQuery, (error, result) => {
            console.log(result)
            console.log(sqlQuery)

            if (error) {
              return res.status(500).json({
                success: 0,
                error: "internal server error",
                message: error,
              });
            }
            // if (result.length == 0) {
            //   return res.status(200).json({
            //     success: 3,
            //     data: [],
            //     // error: "internal server error",
            //     message: "No Assigned Fee For Student's Class",
            //     val: vv
            //   });
            // }
            console.log(result);
            resolve(result);
          });
        }
        catch (error) {
        }
      });
      let getassignedfee = promise3;


      //check preference and fee cart to set feepayable
      let assign = await AssignFeeByStudent(getassignedfee, student);
      console.log("assign is");
      console.log(assign);
      let feedetails = await setfeedetail(getassignedfee, student)
      console.log("feedetails is");

      console.log(feedetails);

      async function generateFee(id, info, assign, feedetails) {


        let scholarship = info[0].scholarship;
        let value = eval(assign.subfee - info[0].scholarship);

        let bal = info[0].accountbalance;


        let amount = eval(
          parseFloat(bal) + parseFloat(value)
        );
        console.log("amount");
        console.log(amount);

        let sqlQuery6 = `update student set arrears = '${bal}', accountbalance ='${amount}',feegeneratecode  ='${code}', feegeneratedate = '${date}', feegenerateforsession = '${data.session}',feepayable = '${value}',preferenceamount = '${assign.exemptedfee}',feedetails='${feedetails}' where student_id = '${id}'`;

        const promise2 = await new Promise((resolve, reject) => {
          console.log(sqlQuery6)
          try {
            pool.query(sqlQuery6, async (error, result) => {
              if (error) {
                console.log(error);
                res
                  .status(500)
                  .json({ success: 1, message: "Internal server", error: error });
              }
              resolve(result);
              // ActivityregisterLog(
              //   "Generate Fee",
              //   data.createdby,
              //   "none",
              //   "Applied",
              //   date,
              //   "Generating fee for all Classes"
              // );


            });
          }
          catch (error) {
          }
        });
      }

      //generate fee from values set
      generateFee(student[0].student_id, student, assign, feedetails);

    }
    let val = data.clazz
    FeeGenerateLog(data, 'Class(es)', val)
    res
      .status(200)
      .json({ success: 1, message: "Fees Generated Successfully", data: data.clazz });
  },


  assignfee: async (req, res) => {
    const data = req.body;
    console.log(data)
    async function forEachAsync(data) {
      let classdata = data.class;

      for (const val of classdata) {
        data.class = val;

        //record the assign fee in assignfeerecord table
        let record = await RecordAssignFee(data);

        //create assign fee in assignfeerecord teable
        let createAssignFee = await CreateAssignFeeClass(data);

        // ActivityregisterLog(
        //   "Assign Fee",
        //   data.createdby,
        //   "none",
        //   "Assign",
        //   date,
        //   `Assign fee for ${val}`
        // );
      }
    }

    async function main(data) {
      await forEachAsync(data);
      // let sqlQuery = `select DISTINCT(class.title), assignfeecartegory.* from class left join assignfeecartegory on class.title = assignfeecartegory.class group by class.title`;
      let sqlQuery = `SELECT * FROM assignfeecartegory group by class,scartegory`;

      try {
        pool.query(sqlQuery, (error, result) => {
          res.status(200).json({ success: 1, data: result });
        });
      }
      catch (error) {
      }
      AssignFeeLog(data.createdby, data.class)
      console.log("Fees Assign logged Successfully");
    }

    main(data);
  },

  payfee: async (req, res) => {
    const data = req.body;
    console.log(data)
    //get initial amount paid value for student
    const promise10 = await new Promise((resolve, reject) => {
      let sqlQuery = `select amountpaid as val,feedetails as feed from student where student_id ='${data.id}' `;
      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, error update account balance `
            );
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }
          resolve(result)


        })
      }
      catch (error) {
      }
    })
    console.log(promise10)
    console.log(data.amountpaid)

    if (promise10.length == 0) return res.status(500).json({
      success: 0,
      error: "internal server error",
      message: 'No Student Found',
    });

    let amountpaidforsession = await promise10[0].val

    let feedetails = await promise10[0].feed

    let splitting_array = feedetails.split(',')
    let split_objects = splitting_array.map(function (str) {
      let box = str.split('-');
      return { item: box[0], fee: Number(box[1]), paid: Number(box[2]), bal: Number(box[3]) }
    });
    //    let extract = split_objects.filter((item) => item.item === feedatas.name)

    // console.log(split_objects)


    let stringif = await loopfeedatils(split_objects, data)
    console.log('BOXXXXXXXXX')
    console.log(stringif)

    const promise2 = await new Promise((resolve, reject) => {
      let sqlQuery = `SELECT * FROM feedetails where receiptid ='${data.receiptid}'`;

      try {
        pool.query(sqlQuery, (error, result) => {
          if (error) return console.log(error)
          resolve(result)
        });
      }
      catch (error) {
      }
    });
    console.log(promise2)
    //  let stringif = promise2.length != 0 ? promise2 : []
    //add with new payment value
    let val = eval(Number(amountpaidforsession) + Number(data.amountpaid))

    // let stringified = await setfeedetailAlt(stringif)

    //update account balances
    const promise1 = await new Promise((resolve, reject) => {
      let sqlQuery = `update student set accountbalance ='${data.balanceafterpayment}' , amountpaid ='${val}', feedetails='${stringif}' where student_id ='${data.id}' `;
      try {
        pool.query(sqlQuery, async (error, result) => {
          if (error) {
            console.log(
              `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, error update account balance `
            );
            return res.status(500).json({
              success: 0,
              error: "internal server error",
              message: error,
            });
          }

          if (result.affectedRows != 1) {
            console.log(
              `${req.method} ${req.originalUrl}, Error updating balance`
            );
            return res.status(200).json({
              success: 0,
              error: error,
              message: "update account balance unsuccessfull ",
            });
          }

          if (result.affectedRows == 1) {
            let recordpayment = await recordfeepayment(data)

            if (data.infotype == "All Sections") {
              let sqlQuery = `select * from student  where student.class = '${data.class}' `;
              try {
                pool.query(sqlQuery, (error, result) => {
                  if (error) {
                    return res.status(500).json({
                      success: 0,
                      error: "internal server error",
                      message: error,
                    });
                  }

                  // logger.info(
                  //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
                  // );
                  return res.status(200).json({
                    success: 1,
                    message: "update account balance successfull ",
                    data: result,
                    response: data,
                  });
                });
              }
              catch (error) {
              }
            } else {
              let sqlQuery = `select * from student  where student.class = '${data.class}' and student.section = '${data.section}'`;
              try {
                pool.query(sqlQuery, (error, result) => {
                  if (error) {
                    return res.status(500).json({
                      success: 0,
                      error: "internal server error",
                      message: error,
                    });
                  }

                  // logger.info(
                  //   `${req.method} ${req.originalUrl},'success', fetch all student by class`
                  // );
                  return res.status(200).json({
                    success: 1,
                    message: "update account balance successfull ",
                    data: result,
                    response: data,
                  });
                });
              }
              catch (error) {
              }
            }



          }

        });

      }
      catch (error) {
      }
    });
    // const promise9 = await new Promise((resolve, reject) => {
    //   let sqlQuery = `UPDARE student SET  where receiptid ='${data.receiptid}'`;

    //   try {
    //     pool.query(sqlQuery, (error, result) => {
    //       if(error) return console.log(error)
    //       resolve(result)  
    //     });
    //   }
    //   catch (error) {
    //   }
    // });


  },
  deleteallasigned: async (req, res) => {
    let data = req.body;
    console.log(data.pref);

    let sqlQuery = `TRUNCATE TABLE assignfeecartegory`;
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          console.log("Delete table values error");
          res.status(500).json({ success: 0, Message: "Error Deleting records" });
        }
        console.log("Delete table successfull");
        res
          .status(200)
          .json({ success: 1, Message: "Table Truncated Successfully" });
      });
    }
    catch (error) {
    }
  },

  preferences: async (req, res) => {
    let data = req.body;
    console.log(data.pref);

    let sqlQuery = `update student set preference ='${data.pref}' where student_id = '${data.id}'  `;
    try {
      pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
          console.log(error);
          return console.log("Update preference  error");
        }

        if (results.affectedRows == 1) {




          let sqlQuery = `select *  from student where student.class='${data.class}' and student.isActive = 'true'; `;
          try {
            pool.query(sqlQuery, (error, result) => {
              console.log(error)
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
  reversefeepayment: (req, res) => {
    let date = new Date();
    date = date.toLocaleDateString("en-CA");
    let data = req.body;
    console.log(data);
    let sqlQuery = `update student set accountbalance ='${data.reverseamount}' where student_id ='${data.id}' `;

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
          let sqlQuery = `insert into feepaymentrecords (student_id,amountinvolved,activity,date,collectedby,class) values
        ('${data.id}',${data.amount},'Payment Reversal','${date}','${data.collectedby}','${data.class}')`;
          try {
            pool.query(sqlQuery, (error, result) => {
              if (error) {
                console.log(
                  `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, error update account balance `
                );
                return res.status(500).json({
                  success: 0,
                  error: "internal server error",
                  message: error,
                });
              }

              if (result.affectedRows != 1) {
                console.log(
                  `${req.method} ${req.originalUrl}, Error updating balance`
                );
                return res.status(200).json({
                  success: 0,
                  error: error,
                  message: "update account balance unsuccessfull ",
                });
              }

              if (result.affectedRows == 1) {
                console.log(
                  `${req.method} ${req.originalUrl}, update fee balance `
                );

                let sqlQuery = `select feepaymentrecords.*, student.firstName, student.otherName, student.lastName ,student.class from feepaymentrecords left join student on feepaymentrecords.student_id = student.student_id order by id desc `;

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
    }
    catch (error) {
    }
  },
  updatebalance: (req, res) => {
    let date = new Date();
    date = date.toLocaleDateString("en-CA");
    let data = req.body;
    let sqlQuery = `update student  set accountbalance ='${data.amount}' where student_id='${data.id}'`;

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
        }
        let val = {
          createdby: data.collectedby,
          createdat: date,
          activity: 'Update Student Account Bal & Arrears',
          balance: data.amount,
          arrears: data.arrears

        }
        if (result.affectedRows == 1) {


          UpdateAccountLog(val)
          let data = req.body;
          let sqlQuery = `insert into feepaymentrecords (student_id,amountinvolved,activity,date,collectedby,class) values
        ('${data.id}','${data.amount}','Update Balance','${date}','${data.collectedby}','${data.class}')`;
          try {
            pool.query(sqlQuery, (error, result) => {
              if (error) {
                console.log(
                  `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, error update account balance `
                );
                return res.status(500).json({
                  success: 0,
                  error: "internal server error",
                  message: error,
                });
              }

              if (result.affectedRows != 1) {
                console.log(
                  `${req.method} ${req.originalUrl}, Error updating balance`
                );
                return res.status(200).json({
                  success: 0,
                  error: error,
                  message: "update account balance unsuccessfull ",
                });
              }

              if (result.affectedRows == 1) {
                console.log(
                  `${req.method} ${req.originalUrl}, update fee balance `
                );
                let sqlQuery = `select feepaymentrecords.*, student.firstName, student.otherName, student.lastName ,student.class from feepaymentrecords left join student on feepaymentrecords.student_id = student.student_id order by id desc `;

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
    }
    catch (error) {
    }
  },
  truncateTable: (req, res) => {
    let sqlQuery = `truncate table fee`;
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete all records`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }
        if (result.affectedRows == 1) {
          console.log(`${req.method} ${req.originalUrl}, delete all records`);
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
  deleteSinglefee: (req, res) => {
    const id = req.params.id;
    let sqlQuery = `delete from fee where id = '${id}'`;
    // let sqlQuery = `delete from fee`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete fee by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          console.log(
            `${req.method} ${req.originalUrl}, delete fee by  id: no fee record found`
          );
          return res.status(200).json({
            success: 0,
            error: "delete fee by id: no fee record found",
          });
        }
        if (result.affectedRows == 1) {

          res.status(200).json({ success: 1 });
        }

      });
    }
    catch (error) {
    }
  },

  deletescholarship: (req, res) => {
    const id = req.params.id;
    console.log(id);
    let sqlQuery = `delete from scholarshiplist where id = '${id}'`;
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
            `${req.method} ${req.originalUrl}, delete scholarship by  id: not found`
          );
          return res.status(200).json({
            success: 0,
            error: "delete scholarship by id: not found",
            message: error,
          });
        }
        if (result.affectedRows == 1) {
          let sqlQuery = `select * from scholarshiplist `;
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
  updatecartitem: (req, res) => {
    const data = req.body;
    console.log(data);
    let sqlQuery = `update  assignfeecartegory set amount = '${data.amount}' where id = '${data.id}'`;
    // let sqlQuery = `delete from fee`;
    console.log(sqlQuery)
    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, update fee Cartegory by id`
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
            error: "update fee Cartegory by id: no fee cartegory record found",
            message: error,
          });
        }
        if (result.affectedRows == 1) {
          let sqlQuery = `select * from feesgroup `;
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
  cartitemdel: (req, res) => {
    const data = req.body;
    console.log(data);
    let sqlQuery = `delete from feesgroup where feeid = '${data.name}'`;
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

        if (!result.affectedRows) {
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
          let sqlQuery = `select * from feesgroup `;
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
  deleteSingleCartfee: (req, res) => {
    const data = req.body;
    console.log(data);
    let sqlQuery = `delete from assignfeecartegory where class = '${data.class}' and scartegory = '${data.cart}'`;
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

        if (result.affectedRows == 0) {
          console.log(
            `${req.method} ${req.originalUrl}, delete fee Cartegory by  id: no fee Cartegory record found`
          );
          return res.status(200).json({
            success: 0,
            error: "delete fee Cartegory by id: no fee cartegory record found",
            message: error,
          });
        }
        if (result.affectedRows) {

          res.status(200).json({ success: 1, data: result });
        }
      });
    }
    catch (error) {
    }
  },
  deletegroupFeeCart: (req, res) => {
    const id = req.body.class;
    let sqlQuery = `delete from assignfeecartegory where class = '${id}'`;
    // let sqlQuery = `delete from fee`;

    try {
      pool.query(sqlQuery, (error, result) => {
        if (error) {
          console.log(
            `${req.method} ${req.originalUrl},'DB error:'${error.sqlMessage}, delete fee stock by id`
          );
          return res
            .status(500)
            .json({ success: 0, error: "internal server error", message: error });
        }

        if (result.affectedRows != 1) {
          console.log(
            `${req.method} ${req.originalUrl}, delete fee by  id: no fee stock record found`
          );
          return res.status(200).json({
            success: 0,
            error: "delete fee sock by id: no fee stock record found",
          });
        }
        if (result.affectedRows == 1) {
          let sqlQuery = `select * from feestock  where isActive = 'true'`;
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
