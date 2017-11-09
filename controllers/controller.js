let express = require("express");
let request = require("request");
let passport = require("passport");
let Strategy = require("passport-local").Strategy;
let sequelize = require('sequelize');

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
  db.Riffs.findAll({
    include: [
      {model: db.Favorites}
    ]
  }).then(function(allRiffs) {
    const resObj = allRiffs.map(riff => {
      return Object.assign({}, {
        id: riff.id,
        title: riff.title,
        sequence: riff.sequence,
        tempo: 120,
        beat_division: riff.beat_division,
        UserId: riff.UserId,
        favorites: riff.Favorites.map(favorite => {
          return Object.assign({}, {
            id: favorite.id,
            user_id: favorite.UserId,
          })
        })
      })
    });
    db.Riffs.findAll({
      include: [
        {model: db.Users}
      ],
      order: [sequelize.col('id')]
    }).then(function(riffUsers) {
      const res2Obj = riffUsers.map(riff => {
        if (riff.User) {
          return Object.assign({}, {
            id: riff.id,
            username: riff.User.dataValues.username
          });
        } else {
          return Object.assign({}, {
            id: riff.id,
            username: ""
          });
        }
      });
      res.render("pages/index", {
        riffs: resObj,
        user: req.user,
        riffUsers: res2Obj,
        filter: "none"
      });
    });
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
    res.render("pages/login", {
      riffs: allRiffs,
      user: req.user
    });
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
    res.render("pages/user", {
      riffs: allRiffs,
      user: req.user
    });
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

router.get("/api/users/:userid", function(req, res) {
  db.Riffs
    .findAll({
      where: {
        UserId: req.params.userid
      },
      include: [{
        model: db.Favorites
      }]
    }).then(function(allRiffs) {
      const resObj = allRiffs.map(riff => {
        return Object.assign({}, {
          id: riff.id,
          title: riff.title,
          sequence: riff.sequence,
          tempo: 120,
          beat_division: riff.beat_division,
          UserId: riff.UserId,
          favorites: riff.Favorites.map(favorite => {
            return Object.assign({}, {
              id: favorite.id,
              user_id: favorite.UserId,
            })
          })
        })
      });
      db.Riffs.findAll({
        where: {
          UserId: req.params.userid
        },
        include: [
          {model: db.Users}
        ],
        order: [sequelize.col('id')]
      }).then(function(riffUsers) {
        const res2Obj = riffUsers.map(riff => {
          if (riff.User) {
            return Object.assign({}, {
              id: riff.id,
              username: riff.User.dataValues.username
            });
          } else {
            return Object.assign({}, {
              id: riff.id,
              username: ""
            });
          }
        });
        res.render("pages/index", {
          riffs: resObj,
          riffUsers: res2Obj,
          user: req.user,
          filter: {type: "user"}
        });
      });
    });
});

/**
 * API Get Route, Finds Riffs by name
 * @param  {Object} req [HTTP Request]
 * @param  {[type]} res [HTTP Response, renders index.ejs]
 */
 router.get('/search/', function(req, res) {
  db.Riffs
    .findAll({
      where: {
        title: req.query.title 
      },
      include: [{
        model: db.Favorites
      }]
    }).then(function(allRiffs) {
      const resObj = allRiffs.map(riff => {
        return Object.assign({}, {
          id: riff.id,
          title: riff.title,
          sequence: riff.sequence,
          tempo: 120,
          beat_division: riff.beat_division,
          UserId: riff.UserId,
          favorites: riff.Favorites.map(favorite => {
            return Object.assign({}, {
              id: favorite.id,
              user_id: favorite.UserId,
            })
          })
        })
      });
      db.Riffs.findAll({
        where: {
          title: req.query.title 
        },
        include: [
          {model: db.Users}
        ],
        order: [sequelize.col('id')]
      }).then(function(riffUsers) {
        const res2Obj = riffUsers.map(riff => {
          if (riff.User) {
            return Object.assign({}, {
              id: riff.id,
              username: riff.User.dataValues.username
            });
          } else {
            return Object.assign({}, {
              id: riff.id,
              username: ""
            });
          }
        });
        res.render("pages/index", {
          riffs: resObj,
          riffUsers: res2Obj,
          user: req.user
        });
      });
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
  let riffObj = {
    title: req.body.title,
    sequence: req.body.sequence,
    tempo: 120,
    beat_division: parseInt(req.body.beat_division),
    num_favorites: 0,
    play_count: 0,
    UserId: req.user.dataValues.id
  }
  db.Riffs.create(riffObj).then(function(newRiff) {
    res.json(newRiff);
  });
});

router.post("/add_favorite", require("connect-ensure-login").ensureLoggedIn(), function(req, res) {
  let newFavorite = {
    RiffId: req.body.riffId,
    UserId: req.user.dataValues.id
  }
  db.Favorites.create(newFavorite).then(function(result) {
    console.log("Added Favorite");
  }).then(function() {
    res.json({"complete" : "true"});
  });
})

router.post("/remove_favorite", require("connect-ensure-login").ensureLoggedIn(), function(req, res) {
  db.Favorites.destroy({
    where: {
      RiffId: req.body.riffId,
      userId: req.user.dataValues.id
    }
  }).then(function() {
    res.json({"complete" : "true"});
  });
})

// =======================================
//             USER ROUTES
// =======================================

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
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
  req.session.destroy(function(err) {
    if (err) throw err;
    res.redirect('/');
  });
});

router.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  function(req, res) {
    res.render("pages/profile", {
      user: req.user
    });
  }
);

module.exports = router;
