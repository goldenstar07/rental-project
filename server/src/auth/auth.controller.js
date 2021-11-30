const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const { pick, omit } = require("lodash");

async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and password are all required." });
  }

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).send({ message: "Email is not valid type." });
  }

  if (
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      password
    )
  ) {
    return res.status(400).send({
      message:
        "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character",
    });
  }

  let user;
  try {
    user = await User.find()
      .where({ email })
      .select("_id firstName lastName email role password")
      .exec();
    user = user[0];
  } catch (err) {
    return next(err);
  }

  if (!user) {
    res.status(404).send("The user with this email doesn't exist");
  }

  try {
    await user.authenticate(password);
  } catch (err) {
    res.status(403).send("The password doesn't match");
  }

  const privateKey = process.env.JWT_PRIVATE_KEY || "apartmentrental";
  const expiresIn = process.env.JWT_EXPIRE || "5d";
  try {
    jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      privateKey,
      { expiresIn },
      function (err, token) {
        if (err) return next(err);
        res.json({
          ...pick(user, ["_id", "firstName", "lastName", "email", "role"]),
          token,
        });
      }
    );
  } catch (err) {
    return next(err);
  }
}

async function signup(req, res, next) {
  const {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    repassword,
    role,
  } = req.body;

  if (await User.findOne({ email: req.body.email })) {
    res.status(409).send({ message: "The email you entered already exists." });
  }

  if (role === "admin") {
    res.status(400).send({ message: "We can not sign up with admin role" });
  }

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

  try {
    const newUser = await user.save();
    let authUser = omit(newUser.toObject(), ["password", "repassword"]);
    res.status(201).send(authUser);
  } catch (err) {
    if (err.name == "ValidationError") {
      for (field in err.errors) {
        return res.status(400).send({ message: err.errors[field].message });
      }
    } else {
      return res.status(500).send({ message: "Internal Server Error" });
    }
    next(err);
  }
}

module.exports = {
  signup,
  login,
};
