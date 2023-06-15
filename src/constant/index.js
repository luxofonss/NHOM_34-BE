"use strict";

const USER_ROLE = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
};

const INFINITY = 10e9

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const ACCESS_TOKEN_EXPIRATION = 30 * 60; // 30 mins

const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
};

const FIREBASE_CONFIGURATION = {
  apiKey: process.env.FBS_API_KEY,
  authDomain: process.env.FBS_AUTH_DOMAIN,
  projectId: process.env.FBS_PROJECT_ID,
  storageBucket: process.env.FBS_STORAGE_BUCKET,
  messagingSenderId: process.env.FBS_MESSAGING_SENDER_ID,
  appId: process.env.FBS_APP_ID,
  measurementId: process.env.FBS_MEASUREMENT_ID,
};

module.exports = {
  USER_ROLE,
  HEADER,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  COOKIE_OPTIONS,
  FIREBASE_CONFIGURATION,
};
