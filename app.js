const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static(__dirname));

app.use(express.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;




  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/a8a63e9fc7";
  const options = {
    method: "POST",
    auth: "keanna:a52bb141a32faad423cdafae10dac359-us10"

  }

  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      console.log(JSON.parse(data));

        if (response.statusCode === 200){
          res.sendFile(__dirname + "/success.html");
        } else {
          res.sendFile(__dirname + "/failure.html");
        }
    });

  });
  request.write(jsonData);
  request.end();
  // res.send()
});

app.post("/failure", function(req, res){
  res.redirect("/");
})



app.listen(process.env.PORT || 3000, function(){
  console.log("Server running.");
});
