const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErrs");
// const ValidationError = require("../utils/validationError");
const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res) => {
  try {
    if (req.body.password !== req.body.password1) {
      // throw new ValidationError("password", "The passwords do not match");
      throw new Error("The passwords do not match.");
    }
    await User.create(req.body);
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      req.flash("error", e.message);
      // req.flash("error", "Unable to register that account.");
    }
    return res.render("register", { errors: req.flash("error") });
  }
  res.redirect("/");
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
