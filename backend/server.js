const express = require("express"); // npm install express
const cors = require("cors"); //Um CORS-Probleme zu verhindern

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
  if (request.body) {
    response.status(201).send(request.body);
  } else {
    response.status(400).send({ error: "Bad Request" });
  }
});

//### Server
app.listen(3001, () => {
  console.log(`listening on port 3001`);
});
