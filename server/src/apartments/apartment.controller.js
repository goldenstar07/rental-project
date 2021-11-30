const Apartment = require("../models/apartment.js");
const { isInteger, isNumber, toNumber } = require("lodash");
const ObjectId = require("mongodb").ObjectID;

function isAdminOrRealtor(role) {
  return role === "admin" || role === "realtor";
}

async function getApartments(req, res, next) {
  try {
    let {
      currentPage = 0,
      rowsCount = 5,
      order = "asc",
      orderBy = "created",
      priceMin = 1,
      priceMax = 10000,
      floorSizeMin = 1,
      floorSizeMax = 10000,
      roomsMin = 1,
      roomsMax = 100,
      rentable,
    } = req.query;

    if (!["asc", "desc"].includes(order)) {
      return res
        .status(400)
        .send({ message: "Order param should be either asc or desc" });
    }

    if (
      ![
        "created",
        "realtor",
        "rentable",
        "lng",
        "lat",
        "pricePerMonth",
        "floorSize",
        "rooms",
        "location",
        "name",
        "location",
        "description",
      ].includes(orderBy)
    ) {
      return res.status(400).send({ message: "OrderBy param is invalid" });
    }
    if (
      !isInteger(toNumber(currentPage)) ||
      !isInteger(toNumber(rowsCount)) ||
      toNumber(currentPage) < 0 ||
      toNumber(rowsCount) < 0
    ) {
      return res.status(400).send({
        message: "Current page and rows per page must be over zero and integer",
      });
    }

    if (
      !isInteger(toNumber(roomsMin)) ||
      !isInteger(toNumber(roomsMax)) ||
      toNumber(roomsMin) <= 0 ||
      toNumber(roomsMax) > 100
    ) {
      return res.status(400).send({
        message: "The number of rooms must be between 0 and 100",
      });
    }

    if (
      !isNumber(toNumber(priceMin)) ||
      !isNumber(toNumber(priceMax)) ||
      toNumber(priceMin) <= 0 ||
      toNumber(priceMax) > 10000
    ) {
      return res.status(400).send({
        message: "The price number must be between 0 and 10000",
      });
    }

    if (
      !isNumber(toNumber(floorSizeMin)) ||
      !isNumber(toNumber(floorSizeMax)) ||
      toNumber(floorSizeMin) <= 0 ||
      toNumber(floorSizeMax) > 10000
    ) {
      return res.status(400).send({
        message: "The floor size number must be between 0 and 10000",
      });
    }

    let where = {};
    if (req.user.role === "realtor") {
      where = { realtor: ObjectId(req.user._id) };
    }
    where["pricePerMonth"] = {
      $gte: parseInt(priceMin),
      $lte: parseInt(priceMax),
    };
    where["floorSize"] = {
      $gte: parseInt(floorSizeMin),
      $lte: parseInt(floorSizeMax),
    };
    where["rooms"] = { $gte: parseInt(roomsMin), $lte: parseInt(roomsMax) };
    if (rentable && rentable === "rentable" && req.user.role === "client") {
      where["rentable"] = true;
    }

    const apartments = await Apartment.find(where)
      .skip(currentPage * rowsCount)
      .limit(parseInt(rowsCount))
      .populate("realtor", "-password -repassword")
      .sort({ [orderBy]: order === "asc" ? 1 : -1 });
    const totalCount = await Apartment.countDocuments(where);

    res.send({ apartments, totalCount });
  } catch (err) {
    next(err);
  }
}

async function addApartment(req, res, next) {
  let {
    name,
    description,
    floor_size: floorSize,
    price: pricePerMonth,
    lat,
    lng,
    realtor,
    rooms,
    location,
    rentable,
  } = req.body;
  if (isAdminOrRealtor(req.user.role)) {
    try {
      if (req.user.role === "realtor") {
        realtor = req.user._id;
      }

      const apartment = new Apartment({
        name,
        description,
        floorSize,
        pricePerMonth,
        lat,
        lng,
        realtor,
        rooms,
        location,
        rentable,
      });

      const createdApartment = await apartment.save();
      res.json(createdApartment);
    } catch (err) {
      if (err.name == "ValidationError") {
        for (field in err.errors) {
          return res.status(400).send({ message: err.errors[field].message });
        }
      } else {
        return res.status(500).send({ message: "Internal Server Error" });
      }
      return next(err);
    }
  } else {
    res
      .status(401)
      .send({ message: "This user doesn't have permission to add apartment" });
  }
}

async function updateApartment(req, res, next) {
  if (isAdminOrRealtor(req.user.role)) {
    try {
      const aprtmentId = req.params.id;
      let apartment;

      if (req.user.role === "realtor")
        apartment = await Apartment.findOne({
          _id: aprtmentId,
          realtor: req.user._id,
        });
      else
        apartment = await Apartment.findOne({
          _id: aprtmentId,
        });

      if (!apartment)
        res.status(404).send({
          message: "We can not find any apartment with this Apartment id",
        });

      for (v in req.body) {
        let key = v;
        if (v === "floor_size") key = "floorSize";
        if (v === "price") key = "pricePerMonth";
        apartment[key] = req.body[v];
        if (req.user.role === "realtor" && v === "realtor") {
          apartment["realtor"] = req.body.realtor;
        }
      }

      try {
        const updatedApartment = await apartment.save();
        res.json(updatedApartment);
      } catch (err) {
        if (err.name == "ValidationError") {
          for (field in err.errors) {
            return res.status(400).send({ message: err.errors[field].message });
          }
        } else {
          return res.status(500).send({ message: "Internal Server Error" });
        }
        return next(err);
      }
    } catch (err) {
      return next(err);
    }
  } else {
    res.status(401).send({
      message: "This user doesn't have permission to update apartments",
    });
  }
}

async function deleteApartment(req, res, next) {
  if (isAdminOrRealtor(req.user.role)) {
    try {
      const apartmentId = req.params.id;
      let apartment;
      if (req.user.role === "realtor")
        apartment = await Apartment.findOne({
          _id: apartmentId,
          realtor: req.user._id,
        });
      else
        apartment = await Apartment.findOne({
          _id: apartmentId,
        });
      await apartment.remove();
      res.status(204).send({
        message: "The selected apartment has been successfully removed.",
      });
    } catch (err) {
      res.status(404).send({
        message:
          "The apartment with this id doesn't exist or is not related to this realtor",
      });
    }
  } else {
    res.status(401).send({
      message: "This user doesn't have permission to delete apartments",
    });
  }
}

async function getTotalApartments(req, res, next) {
  try {
    const {
      priceMin = 1,
      priceMax = 10000,
      floorSizeMin = 1,
      floorSizeMax = 10000,
      roomsMin = 1,
      roomsMax = 100,
    } = req.query;

    if (
      !isInteger(toNumber(roomsMin)) ||
      !isInteger(toNumber(roomsMax)) ||
      toNumber(roomsMin) <= 0 ||
      toNumber(roomsMax) > 100
    ) {
      return res.status(400).send({
        message: "The number of rooms must be between 0 and 100",
      });
    }

    if (
      !isNumber(toNumber(priceMin)) ||
      !isNumber(toNumber(priceMax)) ||
      toNumber(priceMin) <= 0 ||
      toNumber(priceMax) > 10000
    ) {
      return res.status(400).send({
        message: "The price number must be between 0 and 10000",
      });
    }

    if (
      !isNumber(toNumber(floorSizeMin)) ||
      !isNumber(toNumber(floorSizeMax)) ||
      toNumber(floorSizeMin) <= 0 ||
      toNumber(floorSizeMax) > 10000
    ) {
      return res.status(400).send({
        message: "The floor size number must be between 0 and 10000",
      });
    }

    let where = {};

    where["pricePerMonth"] = {
      $gte: parseInt(priceMin),
      $lte: parseInt(priceMax),
    };
    where["floorSize"] = {
      $gte: parseInt(floorSizeMin),
      $lte: parseInt(floorSizeMax),
    };
    where["rooms"] = { $gte: parseInt(roomsMin), $lte: parseInt(roomsMax) };
    if (req.user.role === "client") where["rentable"] = true;

    const apartments = await Apartment.find(where).populate(
      "realtor",
      "-password -repassword"
    );
    const totalCount = await Apartment.countDocuments(where);

    res.send({ apartments, totalCount });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getApartments,
  addApartment,
  updateApartment,
  deleteApartment,
  getTotalApartments,
};
