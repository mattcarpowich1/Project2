let express = require("express");
let bodyParser = require("body-parser");
let dbu = require("./auth");
let db = require("./models");
let passport = require("passport");

let PORT = process.env.PORT || 3000;

let app = express();

// Requiring our models for syncing

// Serve static content for the app from the 'public' directory in the application directory.
app.use(express.static("public"));
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(
  require("body-parser").urlencoded({
    extended: true
  })
);
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// Import routes controller and give the server access to them.
let routes = require("./controllers/controller.js");
app.use("/", routes);

db.sequelize
  .sync({
    force: false
  })
  .then(function() {
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });
