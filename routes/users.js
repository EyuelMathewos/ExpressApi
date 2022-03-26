var express = require('express');
var router = express.Router();
const {
  check,
  oneOf,
  validationResult,
  buildCheckFunction
} = require("express-validator");
var bcrypt = require('bcryptjs');
const ObjectID = require('mongodb').ObjectID;
var privileges = require('../accesscontrol/privilege');
var maindb = require('../config/index.js');
var db = maindb.getDb();
let Customer = require('../model/customer.js');
const {
  user,
  validationResultHandler
} = require("../validator/index.js");

router.route("/")
  /* GET Accounts listing. */
  .get(async (req, res, next) => {
    try {
      const permission = privileges.can('admin').readAny('Account');
      console.log(permission.granted);
      if (permission.granted) {
        let value = await maindb.getAll('Account');

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
      const permission = privileges.can('admin').create('Account');
      console.log(permission.granted);
      if (permission.granted && res.statusCode == 200) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.query.password, salt, (err, hashedPassword) => {
            if (err) {
              console.log(`ERROR : ${err}`);
            } else {
              req.query.password = hashedPassword;

              maindb.create('Account', req.query).then(
                response => {
                  res.status(200).json({
                    id: response.insertedId,
                    Account: req.query.name
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
      if (res.statusCode != 200 && res.statusCode != 422) {
        res.status(403).send('resource is forbidden for this role');
      }
      //
      console.log(error);
    }
  });

router.route("/login")
  .post(async (req, res, next) => {

    let callresp = await maindb.filtter('Account', {name : req.query.name})
      .then(
        response => {
          let value = bcrypt.compareSync(req.query.password, '$2a$10$EyKK4G6Eh978t0kG3n1waOeL0DjygO/rkd4arw154vqvd0kw3fgW6');
          console.log(value)
          if (value == true) {
            return Promise.resolve({
              id: response[0]._id,
              Account: req.query.name
            });

          } else {
            return Promise.resolve(401);
          }
        }
      ).catch(error => {
        return Promise.reject(error);
      })

    if (callresp.id != null && callresp.Account != null) {
      console.log(callresp)
      res.status(200).json(callresp)
    } else {
      res.status(401);
      res.send("incorrect password or Accountname")
    }
  });
router.route("/:id")
  .get(async (req, res, next) => {
    try {
      const permission = privileges.can('admin').readAny('Account');
      console.log(permission.granted);
      if (permission.granted) {
        var objectID = new ObjectID(req.params.id);
        let value = await maindb.filtter('Account', {'_id': objectID})

        res.send(value);
      }
    } catch (error) {
      res.send(error);
    }

  })

  .patch((req, res, next) => {
    try {
      const permission = privileges.can('admin').update('Account');
      console.log(permission.granted);
      if (permission.granted && res.statusCode == 200) {


        maindb.update('Account', '_id', req.params.id, req.query).then(
          response => {
            res.status(200).json({
              id: response.insertedId,
              Account: req.query.name
            })
          }
        ).catch(error => {
          console.log("server error" + error)
        })

      }
    } catch (error) {
      res.send(error);
    }
  })

  .delete(async (req, res, next) => {
    try {
      const permission = privileges.can('admin').delete('Account');
      console.log(permission.granted);
      if (permission.granted) {
        let value = await maindb.delete('Account', '_id', req.params.id)

        res.send(value);
      }
    } catch (error) {
      res.send(error);
    }

  })
  //Access Tokens
  .post((req, res, next) => {
    try {
        const permission = privileges.can('admin').create('accessTokens');
        console.log(permission.granted);
        if (permission.granted) {
          console.log(req.body);
            var objectID = new ObjectID(req.params.id);
            let data = req.body;
            data.clientID = objectID;
            maindb.create('accessTokens', data).then(
                response => {
                    console.log(response);
                    res.status(200).json({
                         response
                    })
                }
            ).catch(error => {
                console.log("server error" + error)
            })
        }
    } catch (error) {
        res.send(error);
    }
});

router.route("/:id/accessTokens")
  .get(async (req, res, next) => {
    try {
      const permission = privileges.can('admin').readAny('accessTokens');
      console.log(permission.granted);
      if (permission.granted) {
        var objectID = new ObjectID(req.params.id);
        let value = await maindb.filtter('accessTokens', {'clientID': objectID})

        res.send(value);
      }
    } catch (error) {
      res.send(error);
    }

  })

  router.route("/:id/accessTokens/:tokenid")
  .get(async (req, res, next) => {
      try {
          const permission = privileges.can('admin').readAny('accessTokens');
          console.log(permission.granted);
          if (permission.granted) {
              var objectTokenID = new ObjectID(req.params.tokenid);
              var objectID = new ObjectID(req.params.id);
              let value = await maindb.filtter('accessTokens', {'_id': objectTokenID,'clientID': objectID})
              res.send(value);
          }
      } catch (error) {
          res.send(error);
      }

  })

  .delete(async (req, res, next) => {
    try {
        const permission = privileges.can('admin').delete('accessTokens');
        console.log(permission.granted);
        if (permission.granted) {
            let value = await maindb.delete('accessTokens', {'_id': req.params.id})

            res.send(value);
        }
    } catch (error) {
        res.send(error);
    }

})




module.exports = router;