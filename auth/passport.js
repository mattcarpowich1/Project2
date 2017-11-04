let passport = require("passport");
let Strategy = require("passport-local").Strategy;
var bCrypt = require("bcrypt-nodejs");

let db = require("../models");

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

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

let findById = function(id, cb) {
  db.Users
    .findOne({
      where: {
        id: id
      }
    })
    .then(function(theUser) {
      if (theUser) return cb(null, theUser);
      else return cb(null, null);
    });
};

let findByUsername = function(username, cb) {
  db.Users
    .findOne({
      where: {
        username: username
      }
    })
    .then(function(theUser) {
      if (theUser) return cb(null, theUser);
      else return cb(null, null);
    });
};
