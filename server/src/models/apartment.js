const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectID;

const apartmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      default: "",
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      default: "",
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      default: "",
      trim: true,
    },
    rooms: {
      type: Number,
      required: [true, "Number of rooms must be specified"],
      get: v => Math.round(v),
      set: v => Math.round(v),
      validate: {
        validator: function (v) {
          return v >= 1 && v <= 100;
        },
        message: props => `${props.value} is not a valid number of rooms!`,
      },
      alias: "i",
    },
    floorSize: {
      type: mongoose.Types.Decimal128,
      required: [true, "Floor Size must be specified"],
      validate: {
        validator: function (v) {
          return v > 0 && v <= 10000;
        },
        message: props => `${props.value} is not a valid floor size!`,
      },
    },
    pricePerMonth: {
      type: mongoose.Types.Decimal128,
      required: [true, "Price per month must be specified"],
      validate: {
        validator: function (v) {
          return v > 0 && v <= 10000;
        },
        message: props => `${props.value} is not a valid price!`,
      },
    },
    lat: {
      type: mongoose.Types.Decimal128,
      required: [true, "Latitude is required"],
      validate: {
        validator: function (v) {
          return v > -90 && v < 90;
        },
        message: props => `${props.value} is not a valid latitude!`,
      },
    },
    lng: {
      type: mongoose.Types.Decimal128,
      required: [true, "Longitude is required"],
      validate: {
        validator: function (v) {
          return v > -180 && v < 180;
        },
        message: props => `${props.value} is not a valid longitude!`,
      },
    },
    created: {
      autoCreate: true,
      type: Date,
      default: new Date(),
      required: true,
    },
    realtor: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "Realtor is required"],
      validate: {
        validator: function (v) {
          return ObjectId(v) !== null;
        },
        message: props => `${props.value} is not a valid object ID!`,
      },
    },
    rentable: {
      autoCreate: true,
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { versionKey: false }
);

const decimal2JSON = (v, i, prev) => {
  if (v !== null && typeof v === "object") {
    if (v.constructor.name === "Decimal128") prev[i] = v.toString();
    else
      Object.entries(v).forEach(([key, value]) =>
        decimal2JSON(value, key, prev ? prev[i] : v)
      );
  }
};

apartmentSchema.set("toJSON", {
  transform: (doc, ret) => {
    decimal2JSON(ret);
    return ret;
  },
});

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;
