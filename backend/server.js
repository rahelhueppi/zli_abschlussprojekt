const express = require("express"); // npm install express
const cors = require("cors"); //Um CORS-Probleme zu verhindern

const swaggerAutogen = require("swagger-autogen");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(cors());

/*Swagger funktioniert noch nicht*/
swaggerAutogen("./swagger_output.json", ["./server.js"]);
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerAutogen));

app.post("/transaction", (request, response) => {
  //const { transactionType } = request.body;
  if (request.body) {
    response.status(201).send(request.body);
    //response.json({msg: "Hello"})
  } else {
    response.status(400).send({ error: "Bad Request" });
  }
});

//Test, ob Frontend mit Backend kommuniziert (kann gelöscht werden)
const testGet = {
  transactionType: "intake",
  title: "test",
};

app.get("/getTransactions", (request, response) => {
  response.status(200).send(testGet);
});
//bis hier Test

// Server
app.listen(3001, () => {
  console.log(`listening on port 3001`);
});
