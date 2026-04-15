const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const PORT = process.env.PORT || 3000
/*const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/ussd_test")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));
const User = mongoose.model("User", {
  phone: String,
  accountNumber: String,
  balance: String
});*/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.post("/ussd", (req, res) =>{
    //Read the variables
    const{
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    }= req.body;
    let response = ""
    if(text == ""){
        // this is the first request
        response = `CON What will you like to check
        1. My Account
        2. My Phone Number`
    }else if(text == "1"){
        // business logic for first level response
        response = `CON Choose account information you want to view
        1. Account Number
        2. Account Balance`
    }else if(text == "2"){
        // get phone number from database
        response = `END Your Phone Number is ${phoneNumber}`
    }else if(text == "1*1"){
        const accountNumber = "Acct1001"
        response = `END Your Account Number is ${accountNumber}`
    }else if(text == "1*2"){
        // get balance from database
        const balance = "₦10,000"
        response = `END Your Balance is ${balance}`
    }
    // send response back to api
    res.set("Content-Type", "text/plain")
    res.send(response)
})
app.listen(PORT, () =>{
    console.log("Server is running on port 3000")
})