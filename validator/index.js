const { check, validationResult } = require("express-validator");
var maindb = require('../config/index');
var db = maindb.getDb();

function user() {
    let user = [
        check("name", "Must be a valid email of 5 to 30 chars")
        .isEmail()
        .isLength({
            min: 5,
            max: 30
        }).custom(async (value) => {
            let values = await maindb.filtter('test', value)
                .then(
                    response => {
                        // console.log(response);
                        if (response.length != 0) {
                            return Promise.reject('E-mail already in use');
                        }
                    }
                ).catch(error => {
                    return Promise.reject(error);
                    //console.log({ error: true, detailerror: error, message: "Oops error Occurred please. Try Again" })
                })
                
            if (values != null) {
                return Promise.reject(values);
            }

        }),
        check("password", "Min 8 and Max 10 chars").isLength({
            min: 8,
            max: 10
        })
    ];
    return user;
}

const validationResultHandler = (req, res, next) => {
    try {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return msg;
        };
        validationResult(req).formatWith(errorFormatter).throw();        
        next();
    } catch (err) {
        res.status(422).json({
            errors: err.mapped()
        });
        next();
    }
};
module.exports = {
    user,
    validationResultHandler
};