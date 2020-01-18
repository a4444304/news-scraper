// this will require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI= process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);
// this is setting up our port to be either the host's designated port or on port 3000
var PORT = process.env.PORT || 3000;

// this will start our Express app
var app = express();

// this will set up an Express router
var router = express.Router();

// this will require our routes file to pass in our router object
require("./config/routes")(router);

// this will designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

// this will connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// to use bodyParser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

// this will have every request go through our router middleware
app.use(router);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// this will connect mongoose to our database
mongoose.connect(db, function(error) {
    // log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    // or log a success message
    else {
        console.log("mongoose connection is successful");
    }
});

// this will listen on the port
app.listen(PORT, function() {
    console.log("listening on port:" + PORT);
});