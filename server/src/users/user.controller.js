const User = require("../models/user.js");
const Apartment = require("../models/apartment.js");
const { isInteger, toNumber, omit } = require("lodash");

function formatSort(order, orderBy) {
  let sort = {};
  sort[orderBy] = order;
  return sort;
}

async function getUsers(req, res, next) {
  const user = req.user;
  const {
    currentPage = 0,
    rowsCount = 5,
    order = "asc",
    orderBy = "created",
  } = req.query;

  if (user.role === "admin") {
    try {
      if (
        !isInteger(toNumber(currentPage)) ||
        !isInteger(toNumber(rowsCount)) ||
        toNumber(currentPage) < 0 ||
        toNumber(rowsCount) < 0
      ) {
        return res.status(400).send({
          message:
            "Current page and rows per page must be over zero and integer",
        });
      }
      let where = {};
      where["role"] = { $ne: "admin" };
      where["_id"] = { $ne: user._id };
      const users = await User.find(where)
        .skip(parseInt(currentPage) * parseInt(rowsCount))
        .limit(parseInt(rowsCount))
        .sort(formatSort(order, orderBy))
        .lean();

      const totalCount = await User.countDocuments(where);
      res.send({ users, totalCount });
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
    res.status(401).send("This user doesn't have permission to get users");
  }
}

async function addUser(req, res, next) {
  if (req.user.role === "admin") {
    try {
      if (await User.findOne({ email: req.body.email })) {
        res
          .status(409)
          .send({ message: "The email you entered already exists." });
      }

      const {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        repassword,
        role,
      } = req.body;

      if (password !== repassword) {
        return res.status(400).send({ message: "Passwords do not match" });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
        repassword,
        role,
      });

      const createdUser = await user.save();
      const authUser = omit(createdUser.toObject(), ["password", "repassword"]);
      res.json(authUser);
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
    res.status(401).send("This user doesn't have permission to add user");
  }
}

async function updateUser(req, res, next) {
  const {
    first_name: firstName,
    last_name: lastName,
    email,
    role,
    password,
    repassword,
  } = req.body;

  if (req.user.role === "admin" || req.user._id === req.params.id) {
    try {
      let userId;
      if (req.user._id === req.params.id) {
        userId = req.user._id;
      } else {
        userId = req.params.id;
      }
      const user = await User.findOne({ _id: userId });

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.role = role || user.role;

      if (password !== repassword) {
        return res.status(400).send({ message: "Passwords do not match" });
      }

      if (password && repassword) {
        user.password = password;
        user.repassword = repassword;
      }

      if (await User.findOne({ email, _id: { $ne: userId } })) {
        res
          .status(409)
          .send({ message: "The email you entered already exists." });
      }

      try {
        const updatedUser = await user.save();
        const authUser = omit(updatedUser.toObject(), [
          "password",
          "repassword",
        ]);
        res.json(authUser);
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
      res.status(404).send("The user with id doesn't exist");
    }
  } else {
    res.status(401).send("This user doesn't have permission to update user");
  }
}

async function deleteUser(req, res, next) {
  if (req.user.role === "admin") {
    try {
      const userId = req.params.id;

      if (req.user._id === userId) {
        res.status(400).send("The admin can't remove his own profile");
      }

      const user = await User.findOne({ _id: userId });
      await user.remove();

      await Apartment.deleteMany({ realtor: userId });
      res
        .status(204)
        .send({ message: "The selected user is successfully deleted" });
    } catch (err) {
      res.status(404).send({ message: "The user with this id doesn't exist" });
    }
  } else {
    res
      .status(401)
      .send({ message: "This user doesn't have permission to delete user" });
  }
}

async function getRealtors(req, res, next) {
  const user = req.user;
  if (user.role === "admin" || user.role === "realtor") {
    try {
      // all realtors and admins except the request user
      const users = await User.find({
        role: { $ne: "client" },
      }).lean();
      res.send({ users });
    } catch (err) {
      next(err);
    }
  } else {
    res
      .status(401)
      .send("This user doesn't have permission to get realtors and admins");
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getRealtors,
};
