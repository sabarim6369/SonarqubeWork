const { verifyToken } = require("../utils/jwt");

const express = require("express")
const router = express.Router();

router.get("/checktokenvalid", verifyToken)

module.exports = router