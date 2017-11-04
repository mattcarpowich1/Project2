let express = require("express");
let request = require("request");
let passport = require("passport");
let Strategy = require("passport-local").Strategy;

let router = express.Router();
let db = require("../models");

// =======================================
//               GET ROUTES
// =======================================

/**
 * HTML Get Route, Renders index.ejs
 * @param  {[type]} req [HTTP Request]
 * @param  {[type]} res [HTTP Response, renders index.ejs]
 */
router.get("/", function(req, res) {
  db.Riffs.findAll({}).then(function(allRiffs) {
    res.render("pages/index", { riffs: allRiffs, user: req.user });
  });
});

/**
 * HTML Get Route, Renders login.ejs
 * @param  {[type]} req [HTTP Request]
 * @param  {[type]} res [HTTP Response, renders login.ejs]
 */
router.get("/login", function(req, res) {
  db.Riffs.findAll({}).then(function(allRiffs) {
    // change to users table when available?
    res.render("pages/login", { riffs: allRiffs, user: req.user });
  });
});

/**
 * HTML Get Route, Renders user.ejs
 * @param  {[type]} req [HTTP Request]
 * @param  {[type]} res [HTTP Response, renders user.ejs]
 */
router.get("/user", function(req, res) {
  db.Riffs.findAll({}).then(function(allRiffs) {
    // change to users table when available
    res.render("pages/user", { riffs: allRiffs, user: req.user });
  });
});

/**
 * API Get Route, Returns all Riffs as JSON
 * @param  {Object} req [HTTP Request]
 * @param  {Object} res [HTTP Response, returns JSON]
 */
router.get("/api/riffs/all", function(req, res) {
  db.Riffs.findAll({}).then(function(allRiffs) {
    res.json(allRiffs);
  });
});

/**
 * API Get Route, Finds a single Riff by id
 * @param  {Object} req [HTTP Request]
 * @param  {Object} res [HTTP Response, returns JSON upon succesful query]
 */
router.get("/api/riffs/:id", function(req, res) {
  db.Riffs
    .findOne({
      where: {
        id: req.params.id
      }
    })
    .then(function(oneRiff) {
      res.json(oneRiff);
    });
});

// =======================================
//             POST ROUTES
// =======================================

/**
 * API Post Route, Inserts new Riff into db
 * @param  {Object} req [HTTP Request, contains riff object in post body]
 * @param  {Object} res [HTTP Response, returns new entry as JSON upon successful query]
 */
router.post("/api/riffs/new", function(req, res) {
  let j = JSON.stringify(req.body, 2, null);
  console.log(j);
  // db.Riffs.create(req.body).then(function(newRiff) {
  //   res.json(newRiff);
  // });
});

// =======================================
//             USER ROUTES
// =======================================

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

router.post(
  "/api/users/new",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/user"
  })
);

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  function(req, res) {
    res.render("pages/profile", { user: req.user });
  }
);

module.exports = router;
