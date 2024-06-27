/*
# author: Rahel Hüppi
# version: 1.0
# date: 27.06.2024
# description: Endpoints for Transactions
*/

const express = require("express");
const router = express.Router();
const con = require("./database"); // import database connection

//### Post-Request, to save a new transaction
router.post("/transaction", (request, response) => {
  let { transactionType, title, amount, date, description, category } =
    request.body;

  //get the persons ID
  con.query(
    `SELECT idPerson FROM person WHERE Name="${request.session.email}"`,
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
router.get("/transactions", async (request, response) => {
  const month = request.query.month;
  const year = request.query.year;
  try {
    //get the persons ID
    con.query(
      `SELECT idPerson FROM person WHERE Name="${request.session.email}"`,
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

//### delete a transaction
router.delete("/transaction/:id", (request, response) => {
  const { id } = request.params;
  console.log(`delete ${id}`);
  con.query(
    `delete from transaction where idTransaction = ${id};`,
    (err, result) => {
      if (err) throw err;
      console.log("1 transaction deleted");
      response
        .status(200)
        .send({ message: "Transaction successfully deleted" });
    }
  );
});

//### export router
module.exports = router;
