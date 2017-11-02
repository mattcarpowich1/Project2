let express = require("express");

let router = express.Router();
let db = require("../models");

// =======================================
//               GET ROUTES
// =======================================

/**
 * HTML Get Route, Renders index.handlebars
 * @param  {[type]} req [HTTP Request]
 * @param  {[type]} res [HTTP Response, renders index.handlebars]
 */
router.get("/", function(req, res) {
  res.render("index");
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
  db.Riffs.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(oneRiff) {
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
router.post("/riffs/new", function(req, res) {
  db.Riffs.create(req.body).then(function(newRiff) {
    res.json(newRiff);
  });
});

module.exports = router;
