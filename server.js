var https   = require("https");
var fs      = require("fs");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require('path')
const app = express();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully!");
});

const invoicesRouter = require("./routes/invoices");
const usersRouter = require("./routes/users");

app.use("/invoices", invoicesRouter);
app.use("/users", usersRouter);
const dirPath = path.join(__dirname, "PDFs");


app.get('/pdfs', (req, res) => {
    res.sendFile(`${dirPath}/Invoice.pdf`);
})
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});



