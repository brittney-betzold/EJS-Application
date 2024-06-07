const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErrs");

const registerShow = (req, res) => {
  res.render("register", { csrfToken: req.csrfToken() });
};

const registerDo = async (req, res) => {
  try {
    if (req.body.password !== req.body.password1) {
      throw new Error("The passwords do not match.");
    }
    await User.create(req.body);
    res.redirect("/");
  } catch (e) {
    if (e.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      req.flash("error", e.message);
    }
    return res.render("register", {
      errors: req.flash("error"),
      csrfToken: req.csrfToken(),
    });
  }
};

const logoff = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon", { csrfToken: req.csrfToken() });
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
