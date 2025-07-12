//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-find-or-create');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config();

// --- App & DB setup ---
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//"mongodb://localhost:27017/socialDb"
mongoose.connect(`mongodb+srv://${process.env.ADMIN}:${process.env.PASS}@cluster0.1xhvswt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


// --- Session & Passport setup ---
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// --- User schema & plugins ---
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  secret: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

// Local strategy provided by passport-local-mongoose
passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id).exec(); // Using .exec() for better query handling
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();  // exec() to return a true promise
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
// --- Google OAuth strategy ---
// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets"
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       let user = await User.findOne({ googleId: profile.id });
//       if (!user) {
//         user = await User.create({ googleId: profile.id });
//       }
//       done(null, user);
//     } catch (err) {
//       done(err, null);
//     }
//   }
// ));
passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({ googleId: profile.id }).exec();
    if (!user) {
  user = new User({
    googleId: profile.id,
    // make sure to supply a unique username too!
    username: profile.id
  });
  await user.save();
}

      cb(null, user);
    } catch (err) {
      cb(err);
    }
  }
));

// --- Routes ---
app.get("/", (req, res) => res.render("home"));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/secrets')
);

app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

app.get("/secrets", async (req, res) => {
  try {
    const foundUsers = await User.find({ secret: { $ne: null } });
    res.render("secrets", { usersWithSecrets: foundUsers });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect('/login');
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// --- Auth routes ---
app.post("/register", async (req, res) => {
  try {
    const newUser = await User.register({ username: req.body.username }, req.body.password);
    passport.authenticate("local")(req, res, () => {
      res.redirect("/secrets");
    });
  } catch (err) {
    console.error(err);
    res.redirect("/register");
  }
});

app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login"
  })
);

app.post("/submit", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  try {
    const secretValue = req.body.secret;
    const user = await User.findById(req.user.id);
    if (user) {
      user.secret = secretValue;
      await user.save();
      res.redirect("/secrets");
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// --- Server start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
