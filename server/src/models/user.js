const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      default: "",
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Email must be unique"],
      required: [true, "Email is required"],
      default: "",
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: () => `Email is not valid string!`,
      },
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password field is required"],
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            v
          );
        },
        message: () =>
          `Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character`,
      },
    },
    repassword: {
      type: String,
      select: false,
      required: [true, "Repassword field is required"],
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            v
          );
        },
        message: () =>
          `Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character`,
      },
    },
    role: {
      type: String,
      enum: ["client", "realtor", "admin"],
      required: [true, "Role must be specified"],
      default: "client",
      trim: true,
      validate: {
        validator: function (v) {
          return ["client", "realtor", "admin"].includes(v);
        },
        message: () => `Role should be one of client, realtor, and admin`,
      },
    },
    created: {
      autoCreate: true,
      type: Date,
      default: new Date(),
      required: true,
    },
  },
  { versionKey: false }
);

userSchema.methods.hashPassword = function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) return reject(new Error(err));
      return resolve(hash);
    });
  });
};

userSchema.methods.authenticate = function authenticate(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, result) {
      if (!result) return reject();
      return resolve();
    });
  });
};

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    this.password = this.hashPassword(this.password)
      .then(hashed => {
        this.password = hashed;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
