/*
# author: Rahel Hüppi
# version: 1.0
# date: 27.06.2024
# description: Endpoints for Authentication
*/

const express = require("express");
const router = express.Router();
const crypto = require("crypto"); // for hash the password
const con = require("./database"); // import database connection

//### Post-Request to save a person
router.post("/register", async (request, response) => {
  try {
    let { registerEmail, registerPassword } = request.body;

    // Check if the username is already registered
    const existingUser = await new Promise((resolve, reject) => {
      con.query(
        `SELECT * FROM person WHERE Name =?`,
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
      var sql = `INSERT INTO person (Name, password) 
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
router.post("/login", (request, response) => {
  let { loginEmail, loginPassword } = request.body;

  // Hash password
  loginPassword = crypto.createHash("sha1").update(loginPassword).digest("hex");

  // Get password of the email
  try {
    con.query(
      `SELECT password, idPerson FROM person WHERE Name="${loginEmail}"`,
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
          } else {
            response.status(401).json({ error: "Unauthorized" });
          }
        } else {
          // Handle case where email not found
          return response.status(404).json({ error: "Username not found" });
        }
      }
    );
  } catch {
    return response.status(500);
  }
});

//### verify, if a user is logged in
router.get("/verify", (request, response) => {
  if (request.session.email) {
    return response.status(200).json({ email: request.session.email });
  }
  return response.status(401).json({ error: "User is not in a session" });
});

//### export router
module.exports = router;
