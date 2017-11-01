let express = require("express");

let router = express.Router();
//  =====  IMPORT MODELS HERE =====

// INDEX ROUTE
router.get("/", function(req, res) {
  res.render("index");
});

module.exports = router;
