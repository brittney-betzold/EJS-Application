require("dotenv").config();
const express = require("express");
require("express-async-errors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const auth = require("./middleware/auth");
const csrfProtection = require("./middleware/csrfProtection");
const passportInit = require("./passport/passportInit");
const connectDB = require("./db/connect");

const app = express();
const recipes = require("./routes/recipes");
const secretWordRouter = require("./routes/secretWord");
const sessionRoutes = require("./routes/sessionRoutes");

app.set("view engine", "ejs");

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(cookieParser(process.env.SESSION_SECRET));

const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", console.log);

const inProduction = app.get("env") === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: inProduction, sameSite: "strict" },
  })
);

passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));

// Apply CSRF protection middleware globally
app.use(csrfProtection);

// Middleware to store CSRF token and user in locals
app.use(require("./middleware/storeLocals"));

// Routes setup
app.use("/sessions", sessionRoutes);
app.use("/secretWord", auth, secretWordRouter);
app.use("/recipes", auth, recipes);

app.get("/", (req, res) => {
  res.render("index");
  // res.render("index", { user: req.user });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

// Start server
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
