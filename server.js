let express = require("express");
let bodyParser = require("body-parser");

let PORT = process.env.PORT || 3000;

let app = express();

// Requiring our models for syncing
var db = require("./models");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// Set Handlebars.
let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes controller and give the server access to them.
let routes = require("./controllers/controller.js");
app.use("/", routes);

db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
