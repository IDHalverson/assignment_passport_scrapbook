const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const { User } = require("../models");

module.exports = req => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:
          process.env.FACEBOOK_URI ||
          "http://localhost:3000/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"]
      },
      function(accessToken, refreshToken, profile, done, req) {
        const facebookId = profile.id;
        const displayName = profile.displayName;
        const images = profile.photos;
        const id = req.user.id;
        User.findOne({ id }).then(user => {
          if (!user) {
            user = new User({ facebookId, displayName, images });
            user.save().then(user => {
              done(null, user);
            });
          } else if (user && user.twitterId) {
            user.displayName = displayName;
            user.facebookId = twitterId;
            user.images = images;
            user.save().then(user => {
              done(null, user);
            });
          } else {
            done(null, user);
          }
        });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
