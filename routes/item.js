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



router.route("/")
    /* GET items listing. */
    .get(async (req, res, next) => {
        try {
            const permission = privileges.can('admin').readAny('item');
            console.log(permission.granted);
            if (permission.granted) {
                let value = await maindb.getAll('item');

                value.map(data => {
                    return data._id = data._id.toString();
                })
                res.send(permission.filter(value));
            }
        } catch (error) {
            res.send(res.send(error));
        }

    })

    // post
    .post((req, res, next) => {
        try {
            const permission = privileges.can('admin').create('item');
            console.log(permission.granted);
            if (permission.granted) {
               // req.query.password = hashedPassword;

                maindb.create('item', req.query).then(
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

    router.route("/:id")
    .get(async (req, res, next) => {
        try {
            const permission = privileges.can('admin').readAny('item');
            console.log(permission.granted);
            if (permission.granted) {
                let value = await maindb.filtter('item', '_id', req.params.id)
                res.send(value);
            }
        } catch (error) {
            res.send(error);
        }

    })

    .patch((req, res, next) => {
        try {
            const permission = privileges.can('admin').update('item');
            console.log(permission.granted);
            if (permission.granted) {


                maindb.update('item', '_id', req.params.id, req.query).then(
                    response => {
                        res.status(200).json({
                            id: response.insertedId,
                            item: req.query.name
                        })
                    }
                ).catch(error => {
                    console.log(error);
                })

            }
        } catch (error) {
            res.send(error);
        }
    })

    .delete(async (req, res, next) => {
        try {
            const permission = privileges.can('admin').delete('item');
            console.log(permission.granted);
            if (permission.granted) {
                let value = await maindb.delete('item', '_id', req.params.id)

                res.send(value);
            }
        } catch (error) {
            res.send(error);
        }

    })




module.exports = router;