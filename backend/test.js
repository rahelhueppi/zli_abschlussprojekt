//### Post-Request, to save a new transaction
/*
app.post("/transaction", (request, response) => {
  let { transactionType, title, amount, date, description, category } =
    request.body;

  //get the persons ID
  con.query(
    `SELECT idPerson FROM person WHERE email="${request.session.email}"`,
    function (err, result) {
      if (err) throw err;
      let idPersonTransaction = result[0].idPerson; // Stellen Sie sicher, dass Sie die ID aus dem Ergebnis extrahieren
      console.log(`Hallo 2 ${idPersonTransaction}`);

      if (idPersonTransaction !== undefined) {
        // Überprüfen Sie, ob idPersonTransaction definiert ist
        //insert data into database
        var sql = `INSERT INTO transaction (transactionType, title, amount, date, description, Person_idPerson, Category_idCategory) 
          VALUES (?,?,?,?,?,?,?)`;
        con.query(
          sql,
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
        response.status(404).send({ error: "User not found" }); // Gibt einen Fehler zurück, falls die ID nicht gefunden wurde
      }
    }
  );
});
*/
