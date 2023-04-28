"use strict";

const USER_ROLE = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
};

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

module.exports = {
  USER_ROLE,
  HEADER,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  COOKIE_OPTIONS,
};
