const User = require('../models/user');
const driver = require('../../neo4jdriver');
const logger = require("../config/appconfig").logger;



module.exports = {
    createUser(req, res, next) {
        let session = driver.session();
        const NewUser = new User(req.body);

        logger.info("createUser was called.");

        User.findOne({userName : req.body.userName})
            .then((user)=> {
                // als de username van de nieuwe user al bestaat (dus niet unique is) dan:
                if (user !== null) {
                    logger.info("username has been used")
                    res.send({
                        Message: `Username ${user.userName} is already taken`
                    })
                }
                //als de username van de nieuwe user unique is dan:
                else {
                    User.create(NewUser)
                        // dit is de response dit we krijgen als een user toegevoegd is
                        .then(user => {
                            res.status(200).send({
                                message: "User successfully created.",
                                userName: user.userName,
                                password: user.password
                            });
                        })
                        // dit is de querie die een user toevoegd aan mongodb
                        .then(() => {
                            session.run(
                                'CREATE (a:User { userName: $userName, password: $password }) RETURN a',
                                {
                                    userName: req.body.userName,
                                    password: req.body.password
                                }
                            );
                            logger.info("New user has been created")
                            session.close();
                        })
                }
            })
            .catch((e) => {
                return res.status(422).send({
                    message: e.toString()
                });
            });
    },


}
