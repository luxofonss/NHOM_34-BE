"use strict";

const express = require("express");
const router = express.Router();

router.use("/api/v1/discount", require("./discount"));
router.use("/api/v1/product", require("./product"));
router.use("/api/v1", require("./access"));

module.exports = router;
