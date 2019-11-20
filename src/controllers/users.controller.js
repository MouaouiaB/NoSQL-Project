const User = require('../models/user');
const driver = require('../../neo4jdriver');
const logger = require("../config/appconfig").logger;

module.exports = {
    createUser(req, res, next) {
        try {
            let session = driver.session();
            const NewUser = new User(req.body);

            logger.info("createUser was called.");

            User.findOne({userName: req.body.userName})
                .then((user) => {
                    // als de username van de nieuwe user al bestaat (dus niet unique is) dan:
                    logger.info("username has been used")
                    res.send({
                        Message: `Username ${user.userName} is already taken`
                    });
                })
                // dit is de response dit we krijgen als een user toegevoegd is
                .catch(() =>{
                res.status(200).send({
                    message: "User successfully created.",
                    userName: NewUser.userName,
                    password: NewUser.password
                });
            });
            //als de username van de nieuwe user unique is dan:
            User.create(NewUser)
            // dit is de querie die een user toevoegd aan mongodb
            .then(() => {
                session.run(
                    'CREATE (u:User { userName: $userName, password: $password }) RETURN u',
                    {
                        userName: req.body.userName,
                        password: req.body.password
                    }
                    );
                logger.info("New user has been created")
                session.close();
            })
        } catch(e) {
            return res.status(422).send({
                message: e.toString()
            });
        };
    },

    updateUser(req, res, next) {
        let session = driver.session();
        const user = req.body;
        const newPassword = req.body.newPassword;

        logger.info("updateUser was called.");

        User.findOne({ userName: user.userName, password: user.currentPassword })
            .then(user => {
                user.set('password', newPassword);
                user.save();
                res.status(200).send({
                    message: "User successfully updated.",
                    userName: user.userName,
                    password: user.password
                });
            })
            .catch(() =>{
                res.status(401).send({
                    status: 401,
                    error: 'The current password is incorrect.'
                });
            })
            .then(() => {
                session.run(
                    'MATCH (n { userName: $userName, password: $currentPassword }) SET n.password = $newPassword RETURN n.userName, n.password',
                    {
                        userName: user.userName,
                        currentPassword: user.currentPassword,
                        newPassword: user.newPassword
                    }
                );
                logger.info("New user has been deleted");
                session.close()
            })
            .catch(error =>{
                //error message
            });
    },

    deleteUser(req, res, next) {
        let session = driver.session();
        const user = req.body;

        logger.info("deleteUser was called.");


        User.findOne({ userName: user.userName, password: user.password })
            .then((user)=>{
                user.remove();
                res.status(200).send({
                    Message: `The user '${user.userName}' is deleted`
                });
            })
            .catch((user) => {
                res.status(401).send({
                    status: 401,
                    error: 'The entered password is incorrect'
                });
            })
            .then(user => {
                session.run(
                    'MATCH (u:User { userName: $userName, password: $password }) -[f:IS_FRIENDS_WITH]-() DELETE u, f',
                    {
                        userName: req.body.userName,
                        password: req.body.password
                    }
                );
                logger.info("New user has been deleted");
                session.close()
            })
            .catch(() => {
                session.close();
                next();
            });
    },



}
