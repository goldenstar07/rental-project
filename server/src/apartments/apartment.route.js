const express = require("express");
const apartmentController = require("./apartment.controller.js");

const router = express.Router();

router.route("/").get(apartmentController.getApartments);
router.route("/").post(apartmentController.addApartment);
router.route("/:id").put(apartmentController.updateApartment);
router.route("/:id").delete(apartmentController.deleteApartment);
router.route("/total").get(apartmentController.getTotalApartments);

module.exports = router;
