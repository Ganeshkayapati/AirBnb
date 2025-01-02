
const User = require("../models/user");
module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
  }

  module.exports.signup=async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const reguser = await User.register(newuser, password);
      req.login(reguser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Bnb");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to Bnb!");
  
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout=async (req, res) => {
    req.logOut((err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "You are logged out succesfully");
      res.redirect("/listings");
    });
  }