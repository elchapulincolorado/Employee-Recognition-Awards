var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  var submitted = req.body;
  if (submitted.loginType == "user") {
    console.log("User attempting to log in with email address: " + submitted.email);
    appRepo.getUserByEmail(submitted.email)
      .then((existingUser) => {
        if (existingUser.password == submitted.password) {
          req.session.loggedInId = existingUser.id;
          req.session.isAdmin = false;
          res.redirect('/user_dashboard');
        } else {
          console.log("User with email found, but password did not match");
          res.redirect('/login');
        }
      }).catch((error) => {
        console.log("No user found when trying to log in with username (email): " + submitted.email, error);
        res.redirect('/login');
      });
  } else {
    console.log("Admin attempting to log in with email address: " + submitted.email);
    appRepo.getAdminByEmail(submitted.email)
      .then((existingAdmin) => {
        if (existingAdmin.password == submitted.password) {
          req.session.loggedInId = existingAdmin.id;
          req.session.isAdmin = true;
          res.redirect('/adminProfile');
        } else {
          console.log("Admin with email found, but password did not match")
          res.redirect('/login');
        }
      }).catch((error) => {
        console.log("No admin found when trying to log in with username (email): " + submitted.email, error);
        res.redirect('/login');
      });
  }
});

module.exports = router;
