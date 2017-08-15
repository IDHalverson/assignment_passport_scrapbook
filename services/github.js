const GitHubStrategy = require("passport-github").Strategy;
const { User } = require("../models");

module.exports = passport => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_APP_ID,
        clientSecret: process.env.GITHUB_APP_SECRET,
        callbackURL:
          process.env.GITHUB_URI ||
          "http://localhost:3000/auth/github/callback",
        profileFields: ["id", "displayName", "photos", "emails"]
      },
      function(token, tokenSecret, profile, cb) {
        console.log(profile);
        const githubId = profile.id;
        const displayName = profile.displayName;
        const githubImages = profile.photos;
        User.findOne({ displayName }).then(user => {
          if (!user) {
            user = new User({
              githubId,
              displayName,
              githubImages
            });
            user
              .save()
              .then(user => {
                return cb(null, user);
              })
              .catch(e => {
                if (e) throw e;
              });
          } else {
            user.githubId = githubId;
            user.githubImages = githubImages;
            user
              .save()
              .then(user => {
                return cb(null, user);
              })
              .catch(e => {
                if (e) throw e;
              });
          }
        });
      }
    )
  );

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    User.findById(id, function(err, user) {
      cb(err, user);
    });
  });
};