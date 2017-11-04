let db = require("../models");

exports.findById = function(id, cb) {
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

exports.findByUsername = function(username, cb) {
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
