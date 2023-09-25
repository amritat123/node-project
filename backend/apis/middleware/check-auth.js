const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.userData = decoded;
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(401).send({
      message: "Auth fail",
    });
  }
};
