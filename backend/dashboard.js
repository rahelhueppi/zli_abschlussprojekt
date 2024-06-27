/*
# author: Rahel Hüppi
# version: 1.0
# date: 27.06.2024
# description: Informations for the dashboard
*/

const express = require("express");
const router = express.Router();
const con = require("./database"); // import database connection

//#### Get-Request to get all transactions
router.get("/balance", async (request, response) => {
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
            `SELECT transactionType, amount FROM transaction WHERE Person_idPerson = ${idPerson}`, //2024-06-07
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

//### get the number of Transactions
router.get("/numberTransactions", async (request, response) => {
  result = [];
  try {
    //get the persons ID
    con.query(
      `SELECT idPerson FROM person WHERE Name="${request.session.email}"`,
      function (err, result) {
        if (err) throw err;
        let idPerson = result[0].idPerson; // extract id out of the result

        if (idPerson !== undefined) {
          //search the number of transactions from this person
          con.query(
            `SELECT count(*) as numberTransactions FROM transaction WHERE Person_idPerson = ${idPerson}`,
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
  } catch {
    response.status(500);
  }
});

//### export router
module.exports = router;
