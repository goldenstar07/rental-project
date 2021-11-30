const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers["x-access-token"] || req.headers["authorization"];

  if (!header)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided" });

  const token = header.split(" ");

  if (!token[1])
    return res
      .status(401)
      .send({ message: "Access denied. No token provided" });

  try {
    const decoded = jwt.verify(
      token[1],
      process.env.JWT_PRIVATE_KEY || "apartmentrental"
    );
    req.user = decoded;

    next();
  } catch (err) {
    console.log("err: ", token[1], err);
    res.status(403).send({ message: "Invalid Token" });
  }
};
