const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
  const { email, password, username } = req.body;
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);

  req.login(registeredUser, (err) => {
    if (err) return next(err);
    req.flash("success", "Welcome to Airbnb!");
    res.redirect(req.session.redirectUrl || "/listings");
  });
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};



module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  // Step 1: Check if the user exists
  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    req.flash("error", `User not found. <a href='/signup' class='flash-link'>Sign up here</a>.`);

    return res.redirect("/login");
  }

  // Step 2: Authenticate the password
  const { user, error } = await User.authenticate()(username, password);

  if (error || !user) {
    req.flash("error", "Incorrect password.");
    return res.redirect("/login");
  }

  // Step 3: Log the user in
  req.login(user, (err) => {
    if (err) return next(err);
    req.flash("success", "Welcome back to Airbnb!");
    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  });
};

module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
