const User = require('../models/user');
const driver = require('../../neo4jdriver');
const logger = require("../config/appconfig").logger;

module.exports = {
    //het toevoegen van vriendschap door 2 usernames
    createFriendship(req, res, next) {
        let session = driver.session();
        const userName1 = req.body.userName;
        const userName2 = req.body.userName;
        const  user1 = User.findOne({user: userName1})
        const  user2 = User.findOne({user: userName2})

        logger.info('createFriendship is called')

        Promise.all([user1, user2])
            .then(() => {
                session.run(
                    'MATCH (a:User),(b:User) WHERE a.userName = $userName1 AND b.userName = $userName2 CREATE UNIQUE (a)<-[r:IS_FRIENDS_WITH]- (b) CREATE UNIQUE (a)- [s:IS_FRIENDS_WITH]->(b)',
                    {
                        userName1: userName1,
                        userName2: userName2
                    }
                    );
                logger.info("De users zij nu vrienden");
                session.close()
            })
            .then(() =>
                res.status(200).json({
                    message: 'Yesss, de users zijn nu vrienden'
                }))
            .catch(() => {
                logger.error('error: ', Error);
                res.status(500).json({
                    message: Error,
                    error: 'Iet gaat mis! Users zijn al vrienden!!'
                });
            })
    },


        deleteFriendship(req, res, next) {
        let session = driver.session();

        session.run(
            'MATCH (:User {userName: $userName1})-[r:IS_FRIENDS_WITH]-(:User {userName: $userName2}) DETACH DELETE r',
            {
                userName1: req.body.userName1,
                userName2: req.body.userName2
            }
        )
            .then(() => res.status(200).send({Message : req.body.userName1 + ' ended friendship with '+ req.body.userName2}))
            .catch(() => {
                res.status(422).send();
                next();
            });
    }
};



