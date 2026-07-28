// src/config/index.js

/* =========================================
   CONFIG MODULES
========================================= */

const env = require("./env");

const jwt = require("./jwt");

const cors = require("./cors");

const cookies = require("./cookie");

/* =========================================
   EXPORTS
========================================= */

module.exports = {
  env,
  jwt,
  cors,
  cookies,
};