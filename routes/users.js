var express = require('express');
var router = express.Router();
const {
  check,
  oneOf,
  validationResult,
  buildCheckFunction
} = require("express-validator");
var bcrypt = require('bcryptjs');
var privileges = require('../accesscontrol/privilege');
var maindb = require('../config/index.js');
var db = maindb.getDb();
let Customer = require('../model/customer.js');
const {
  user,
  validationResultHandler
} = require("../validator/index.js");

router.route("/")
  /* GET users listing. */
  .get(async (req, res, next) => {
    try {
      const permission = privileges.can('admin').readAny('user');
      console.log(permission.granted);
      if (permission.granted) {
        let value = await maindb.getAll('test');

        value.map(data => {
          return data._id = data._id.toString();
        })
        res.send(permission.filter(value));
      }
    } catch (error) {
      res.status(403).send('resource is forbidden for this role');
      //console.log(error);
    }

  })

  // post
  .post(user(), validationResultHandler, (req, res, next) => {
    try {
      const permission = privileges.can('admin').create('user');
      console.log(permission.granted);
    if (permission.granted && res.statusCode == 200 ) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.query.password, salt, (err, hashedPassword) => {
          if (err) {
            console.log(`ERROR : ${err}`);
          } else {
            req.query.password = hashedPassword;

            maindb.create('test', req.query).then(
              response => {
                res.status(200).json({
                  id: response.insertedId,
                  user: req.query.name
                })
              }
            ).catch(error => {
              console.log("server error" + error)
            })


          }
        });
      });
    }
  } catch (error) {
   if(res.statusCode!= 200 && res.statusCode!=422){
     res.status(403).send('resource is forbidden for this role');
    }
    //
    console.log(error);
  }
  });

router.route("/login")
  .post(async (req, res, next) => {

    let callresp = await maindb.filtter('test', req.query.name)
      .then(
        response => {
          let value = bcrypt.compareSync(req.query.password, '$2a$10$EyKK4G6Eh978t0kG3n1waOeL0DjygO/rkd4arw154vqvd0kw3fgW6');
          console.log(value)
          if (value == true) {
            return Promise.resolve({
              id: response[0]._id,
              user: req.query.name
            });

          } else {
            return Promise.resolve(401);
          }
        }
      ).catch(error => {
        return Promise.reject(error);
      })

    if (callresp.id != null && callresp.user != null) {
      console.log(callresp)
      res.status(200).json(callresp)
    } else {
      res.status(401);
      res.send("incorrect password or username")
    }
  });


module.exports = router;