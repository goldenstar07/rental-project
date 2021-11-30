const express = require("express");
const userController = require("./user.controller.js");

const router = express.Router();

router.route("/").get(userController.getUsers);
router.route("/").post(userController.addUser);
router.route("/:id").put(userController.updateUser);
router.route("/:id").delete(userController.deleteUser);
router.route("/realtors").get(userController.getRealtors);

module.exports = router;
