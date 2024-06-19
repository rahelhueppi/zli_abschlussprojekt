/*
Durch das Modul nodemon wird das Programm bei jeder Dateiänderung neu gestartet, ohne dass man es manuell starten muss. Dieses Modul wird so installiert und gestartet:
Npm install -g nodemon
Nodemon filename.js
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

//connect once (or else it will trow an error)
con.connect((err) => {
  if (err) throw err;
  console.log("Connected with database");
});

const swaggerAutogen = require("swagger-autogen");
const swaggerUi = require("swagger-ui-express");

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

//### Swagger doesn't work
swaggerAutogen("./swagger_output.json", ["./server.js"]);
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerAutogen));
//swagger bis hier

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

//##### Authentication

//### Post-Request to save a person
app.post("/register", (request, response) => {
  let { registerEmail, registerPassword } = request.body;
  if (request.body) {
    response.status(201).send(request.body);

    //hash password
    hashPassword = crypto
      .createHash("sha1")
      .update(registerPassword)
      .digest("hex");

    //insert data into database
    var sql = `INSERT INTO person (email, password) 
      VALUES ('${registerEmail}', '${hashPassword}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`1 person inserted`);
    });
  } else {
    response.status(400).send({ error: "Bad Request" });
  }
});

//### Post-Request, to log in

app.post("/login", (request, response) => {
  let { loginEmail, loginPassword } = request.body;

  //hash password
  loginPassword = crypto.createHash("sha1").update(loginPassword).digest("hex");
  //get password of the email
  con.query(
    `SELECT password, idPerson FROM person WHERE email="${loginEmail}"`,
    function (err, resultSelect) {
      if (err) throw err;
      //console.log(`DB: ${resultSelect[0].password}`);
      //console.log(`login: ${loginPassword}`);
      const idPerson = resultSelect[0].idPerson;

      if (loginPassword === `${resultSelect[0].password}`) {
        request.session.email = loginEmail;
        return response
          .status(200)
          .json({ email: request.session.email, idPerson: idPerson });
      }
      return response.status(401).json({ error: "Invalid credentials" });
    }
  );
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
