let express = require("express");
let bodyParser = require("body-parser");
let passport = require("passport");
let Strategy = require("passport-local").Strategy;
var bCrypt = require("bcrypt-nodejs");
let dbu = require("./users");
var db = require("./models");

let PORT = process.env.PORT || 3000;

passport.use(
  new Strategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {
      var User = db.Users;

      var isValidPassword = function(userpass, password) {
        return bCrypt.compareSync(password, userpass);
      };

      db.Users
        .findOne({
          where: {
            email: email
          }
        })
        .then(function(user) {
          if (!user) {
            return done(null, false, {
              message: "Email does not exist"
            });
          }

          if (!isValidPassword(user.password, password)) {
            return done(null, false, {
              message: "Incorrect password."
            });
          }

          var userinfo = user.get();
          return done(null, userinfo);
        })
        .catch(function(err) {
          console.log("Error:", err);

          return done(null, false, {
            message: "Something went wrong with your Signin"
          });
        });
    }
  )
);

passport.use(
  "local-signup",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };
      db.Users
        .findOne({
          where: {
            email: email
          }
        })
        .then(function(user) {
          if (user) {
            return done(null, false, {
              message: "That email is already taken"
            });
          } else {
            var userPassword = generateHash(password);
            var data = {
              email: email,
              password: userPassword,
              displayName: req.body.displayName,
              username: req.body.username
            };

            db.Users.create(data).then(function(newUser, created) {
              if (!newUser) {
                return done(null, false);
              }

              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
    }
  )
);

// Configure Passport authenticated session persistence.
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  dbu.users.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

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
    force: true
  })
  .then(function() {
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });
