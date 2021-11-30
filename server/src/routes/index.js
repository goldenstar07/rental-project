const express = require("express");
const auth = require("../auth/auth.route.js");
const user = require("../users/user.route.js");
const apartment = require("../apartments/apartment.route.js");

const router = express.Router();
const authMiddleware = require("../middlewares");

router.use("/auth", auth);
router.use("/users", authMiddleware, user);
router.use("/apartments", authMiddleware, apartment);

module.exports = router;
