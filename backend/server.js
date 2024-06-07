const express = require("express"); // npm install express
const cors = require("cors"); //Um CORS-Probleme zu verhindern
var mysql = require("mysql");

//db
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "financemanager",
});

/*
con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM category", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});*/

/*
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO category (name) VALUES ('categoryFromJS')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});*/

const swaggerAutogen = require("swagger-autogen");
const swaggerUi = require("swagger-ui-express");

const app = express();

//### Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
//JSON middleware enables sending JSON data to endpoints, making them accessible as js objects.
app.use(express.json());

//### Swagger doesn't work
swaggerAutogen("./swagger_output.json", ["./server.js"]);
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerAutogen));
//swagger bis hier

//### Post-Request, to save a new transaction
app.post("/transaction", (request, response) => {
  let { transactionType, title, amount, date, description, category } =
    request.body;
  if (request.body) {
    response.status(201).send(request.body);
    //insert data into database
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      //noch person einfügen
      var sql = `INSERT INTO transaction (transactionType, title, amount, date, description, Person_idPerson, Category_idCategory) 
      VALUES ('${transactionType}', '${title}', '${amount}', '${date}', '${description}', '1', '${category}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
  } else {
    response.status(400).send({ error: "Bad Request" });
  }
});

//### Server
app.listen(3001, () => {
  console.log(`listening on port 3001`);
});
