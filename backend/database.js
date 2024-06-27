/*
# author: Rahel Hüppi
# version: 1.0
# date: 27.06.2024
# description: connect with database once (to use in the other files)
*/

//### database
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "financemanager",
});

// connect with database
con.connect((err) => {
  if (err) throw err;
  console.log("Connected with database");
});

// export con
module.exports = con;
