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
                    //als de username van de nieuwe user unique is dan:
                    if (user === null || user === undefined){
                        logger.info('user is null');
                        // dit is de querie die een user toevoegd aan no4j
                        session.run(
                            'CREATE (u:User { userName: $userName, password: $password }) RETURN u',
                            {
                                userName: req.body.userName,
                                password: req.body.password
                            }
                        );
                        logger.info("New user has been created")
                        session.close();
                        //  // dit is hoe de user wordt toevoegd aan mongodb
                        return User.create(NewUser)
                        // als de username van de nieuwe user al bestaat (dus niet unique is) dan:
                    }else{
                        logger.info("username is al gebruikt")
                        throw new Error('username is al gebruikt ')
                    }
                })
                .then((user)=>{
                    logger.info('print the user', user)
                    res.status(200).json({
                        message: `De user ${user.userName} is toegevoed`
                    })
                })
                // dit is de response dit we krijgen als een user toegevoegd is
                .catch((error) =>{
                    logger.error('error: ', error)
                    res.status(500).json({
                        message: 'username is al gebruikt',
                        error: 'Er ging iets mis!!'
                });

            });
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
                logger(error.toString());
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
