const passport = require("passport");
const { ErrorResponse } = require("../core/error.response");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");
const UserService = require("../services/user.service");
const crypto = require("node:crypto");
const createKeys = require("../utils/createKey");
const { createTokenPair } = require("./authUtils");
const KeyStoreService = require("../services/keyToken.service");
const { USER_ROLE } = require("../constant");

require("dotenv").config();

console.log("passport running");

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

      console.log("foundUser:: ", user);

      if (user) {
        req.user = user;
        return cb(null, user);
      } else {
        try {
          const newUser = await UserService.createByOAuth({
            name: defaultUser.fullName,
            email: defaultUser.email,
            oauthId: defaultUser.googleId,
            oauthService: "Google",
          });

          if (newUser) {
            // create public key, private key
            const { privateKey, publicKey } = createKeys();
            console.log({ privateKey, publicKey });

            // create token pair
            const publicKeyObject = crypto.createPublicKey(publicKey);
            const privateKeyObject = crypto.createPrivateKey(privateKey);

            const tokens = await createTokenPair(
              {
                userId: newUser._id,
                email: newUser.email,
                roles: [USER_ROLE.SHOP],
              },
              publicKeyObject,
              privateKeyObject
            );

            const keyStore = await KeyStoreService.createKeyToken({
              userId: newUser._id,
              privateKey,
              publicKey,
              refreshToken: tokens.refreshToken,
            });

            if (!keyStore) {
              throw new BadRequestError("Error: Key token is not available");
            }
          }
          return cb(null, newUser);
        } catch (error) {
          cb(error, null);
        }
      }
    }
  )
);
