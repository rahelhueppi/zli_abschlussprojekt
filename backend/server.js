/*
# author: Rahel Hüppi
# version: 1.0
# date: 27.06.2024
# description: Main file coordinating app modules
*/

const express = require("express"); // npm install express
const app = express();
const cors = require("cors"); //Um CORS-Probleme zu verhindern
const session = require("express-session");

//import routes
const transactionRoutes = require("./transaction");
const authRoutes = require("./authentication");
const dashboardRoutes = require("./dashboard");

//### Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// JSON middleware enables sending JSON data to endpoints,
// making them accessible as js objects.
app.use(express.json());
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);

// use routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/dashboard", dashboardRoutes);

//### Server
app.listen(3001, () => {
  console.log(`listening on port 3001`);
});
