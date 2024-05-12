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

          res.status(500).send({ message: "already exist" });
          return;
        }

        next();
    })
    .catch((y) => {
      res.status(500).send({ message: "check error" });
      return;
    });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
