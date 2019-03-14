require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const bodyParser = require("body-parser");

// habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, "../public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require("./routes/index"));

mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw err;

    console.log("base de datos conectada");
  }
);

app.listen(process.env.PORT, () =>
  console.log("Escuchando en puerto ", process.env.PORT)
);
