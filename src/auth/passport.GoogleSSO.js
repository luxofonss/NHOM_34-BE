const passport = require("passport");
const { ErrorResponse } = require("../core/error.response");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");
const UserService = require("../services/user.service");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      accessType: "offline",
      prompt: "consent",
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      const defaultUser = {
        fullName: `${profile.name.givenName} ${profile.name.familyName} `,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        googleId: profile.id,
      };

      const user = await UserService.findByOAuthId(
        "Google",
        defaultUser.googleId
      );

      if (user) {
        req.user = user;
        return cb(null, user);
      }

      if (!user) {
        try {
          const newUser = await UserService.createByOAuth({
            name: defaultUser.fullName,
            email: defaultUser.email,
            oauthId: defaultUser.googleId,
            oauthService: "Google",
          });
          return cb(null, newUser);
        } catch (error) {
          cb(error, null);
        }
      }
    }
  )
);

passport.serializeUser((user, callback) => {
  console.log("serializeUser ", user);
  callback(null, user._id);
});

passport.deserializeUser(async (id, callback) => {
  try {
    const user = await UserService.findByUserId({ userId: id });
    console.log("deserialized user: ", user);
    callback(null, user);
  } catch (error) {
    callback(error, null);
  }
});
