const express = require("express");
const cors=require("cors")
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRouter = require("./src/routes/router");
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

app.use(cors())

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config({ path: path.resolve(__dirname, '.env') });


app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Example apps listening on ports ${port}`);
});
