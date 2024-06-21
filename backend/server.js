/*
# author: Rahel Hüppi
# version: 1.0
# date: 20.06.2024
# description: To process the requests 
# and/or communicate with the database.
*/

const express = require("express"); // npm install express
const cors = require("cors"); //Um CORS-Probleme zu verhindern
//const authenticationRouter = require("./authentication.js");
const session = require("express-session");
const crypto = require("crypto"); //to hash a password

var mysql = require("mysql");

//db
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "financemanager",
});

//connect once
con.connect((err) => {
  if (err) throw err;
  console.log("Connected with database");
});

const app = express();

//### Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
//JSON middleware enables sending JSON data to endpoints, making them accessible as js objects.
app.use(express.json());
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);

//connect with file authentication.js
//app.use("/authentication", authenticationRouter);

//### Post-Request, to save a new transaction
app.post("/transaction", (request, response) => {
  let { transactionType, title, amount, date, description, category } =
    request.body;

  //get the persons ID
  con.query(
    `SELECT idPerson FROM person WHERE email="${request.session.email}"`,
    function (err, result) {
      if (err) throw err;
      let idPersonTransaction = result[0].idPerson; // extract id out of the result

      if (idPersonTransaction !== undefined) {
        //insert data into database
        var sql = `INSERT INTO transaction (transactionType, title, amount, date, description, Person_idPerson, Category_idCategory) 
          VALUES (?,?,?,?,?,?,?)`; // ? = placeholder
        con.query(
          sql,
          //fill placeholder
          [
            transactionType,
            title,
            amount,
            date,
            description,
            idPersonTransaction,
            category,
          ],
          function (err, result) {
            if (err) throw err;
            console.log("1 transaction inserted");
            response
              .status(201)
              .send({ message: "Transaction successfully added" });
          }
        );
      } else {
        // throw error if the user was not found
        response.status(404).send({ error: "User not found" });
      }
    }
  );
});

//#### Get-Request to get all transactions
app.get("/transactions", async (request, response) => {
  const month = request.query.month;
  const year = request.query.year;
  try {
    //get the persons ID
    con.query(
      `SELECT idPerson FROM person WHERE email="${request.session.email}"`,
      function (err, result) {
        if (err) throw err;
        let idPerson = result[0].idPerson; // extract id out of the result

        if (idPerson !== undefined) {
          //search all transactions from this person
          con.query(
            `SELECT * FROM transaction WHERE Person_idPerson = ${idPerson} 
            AND (date LIKE "${year}-${month}%" OR date LIKE "${year}-0${month}%")`, //2024-06-07
            (err, result) => {
              //send result/transactions
              response.status(200).send(result);
            }
          );
        } else {
          response.status(404).send({ error: "User not found" });
        }
      }
    );
  } catch (error) {
    response.status(404).send({ error: "Not found" });
  }
});

//######### Authentication ###############

//### Post-Request to save a person
app.post("/register", async (request, response) => {
  try {
    let { registerEmail, registerPassword } = request.body;

    // Check if the username is already registered
    const existingUser = await new Promise((resolve, reject) => {
      con.query(
        `SELECT * FROM person WHERE email =?`,
        [registerEmail],
        (err, result) => {
          if (err) reject(err);
          resolve(result.length > 0); // Returns true if email exists
        }
      );
    });

    if (existingUser) {
      // Email already exists, send error response
      return response.status(409).send({ error: "Email already in use" });
    } else {
      // Hash password
      const hashPassword = crypto
        .createHash("sha1")
        .update(registerPassword)
        .digest("hex");

      // Insert data into database
      var sql = `INSERT INTO person (email, password) 
    VALUES ('${registerEmail}', '${hashPassword}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`1 person inserted`);
      });
      response.status(201).send({ message: "Registration successful" });
    }
  } catch (error) {
    console.error(error);
    response.status(400).send({ error: "Bad Request" });
  }
});

//### Post-Request, to log in

app.post("/login", (request, response) => {
  let { loginEmail, loginPassword } = request.body;

  // Hash password
  loginPassword = crypto.createHash("sha1").update(loginPassword).digest("hex");

  // Get password of the email
  try {
    con.query(
      `SELECT password, idPerson FROM person WHERE email="${loginEmail}"`,
      function (err, resultSelect) {
        if (err) {
          console.error(err);
          return response.status(500).json({ error: "Database error" });
        }

        // Check if resultSelect has at least one element
        if (resultSelect.length > 0) {
          const idPerson = resultSelect[0].idPerson;

          // Compare entered password with pw in db
          if (loginPassword === `${resultSelect[0].password}`) {
            request.session.email = loginEmail;
            return response
              .status(200)
              .json({ email: request.session.email, idPerson: idPerson });
          }
        } else {
          // Handle case where email not found
          return response.status(404).json({ error: "Email not found" });
        }
      }
    );
  } catch {
    return response.status(500);
  }
});

//### verify, if a user is logged in
app.get("/verify", (request, response) => {
  if (request.session.email) {
    return response.status(200).json({ email: request.session.email });
  }
  return response.status(401).json({ error: "User is not in a session" });
});

//### Server
app.listen(3001, () => {
  console.log(`listening on port 3001`);
});
