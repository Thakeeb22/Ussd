require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));
const User = mongoose.model("User", {
  phone: String,
  name: String,
  accountNumber: String,
  balance: String,
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/ussd", async (req, res) => {
  console.log("USSD REQUEST:", req.body);

  //Read the variables
  const { phoneNumber, text } = req.body;
  let response = "";
  //   split input
  const data = text.split("*");
  //   check if user exist
  let user = await User.findOne({ phone: phoneNumber });

  if (text === "") {
    // this is the first request
    response = `CON Welcome to Test App
        1. Register
        2. My Account`;
    // Register
  } else if (text === "1") {
    response = `CON Enter Your Name`;
  } else if (data[0] === "1" && data.length === 2) {
    // save name temporarilly
    response = `CON Enter Your Balance`;
  } else if (data[0] === "1" && data.length === 3) {
    const name = data[1];
    const balance = data[2];
    const accountNumber = generateAccountNumber();
    await User.create({
      phone: phoneNumber,
      name,
      balance,
      accountNumber,
    });
    response = `END Registered successfully
    Acct:${accountNumber}`;
    // view account
  } else if (text === "2") {
    if (!user) {
      response = `END You are not registered`;
    } else {
      response = `END Name: ${user.name}
        Acct:${user.accountNumber}
        Balance:${user.balance}`;
    }
  } else {
    response = `END Invalid option`;
  }
  // send response back to api
  res.set("Content-Type", "text/plain");
  res.status(200).send(response);
});
app.get("/", (req, res) => {
  res.send("USSD server running");
});
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
function generateAccountNumber() {
  return "ACCT" + Math.floor(100000 + Math.random() * 900000);
}
