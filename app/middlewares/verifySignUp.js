const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    username: req.body.username,
  })
    .then((y) => {
      

      if(y)
        {
      next();
        }
        {

          res.status(500).send({ message: "already exist" });
        }
    })
    .catch((y) => {
      res.status(500).send({ message: "check error" });
    });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
