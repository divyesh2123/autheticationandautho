const db = require("../models");
const User = db.user;
const Role = db.role;
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config")

exports.signup = (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });
  
    user.save().then(user => {
      
  
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles }
          })
          .then( roles => {
           
  
            user.roles = roles.map(role => role._id);
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
  
              res.status(201).send({ message: "User was registered successfully!" });
              return;
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }).then(role => {
         
  
          user.roles = [role._id];
          user.save().then(y => {
           
  
            res.status(201).send({ message: "User was registered successfully!" });
            return;
          
          });
        });
      }
    });
  };


  exports.signin = (req, res) => {

    console.log(req.body.username);
    User.findOne({
      username: req.body.username
    })
      .populate("roles", "-__v")
      .exec()
      .then(user => {
       
  
          console.log(user);
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
  
        const token = jwt.sign({ id: user.id },
                                config.secret,
                                {
                                  algorithm: 'HS256',
                                  allowInsecureKeySizes: true,
                                  expiresIn: 86400, // 24 hours
                                });
  
        var authorities = [];
  
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
  };