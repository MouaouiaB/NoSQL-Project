const neo4j = require('neo4j-driver').v1;

let driver;

driver = neo4j.driver('bolt://hobby-lginlebfkikggbkehnimiddl.dbs.graphenedb.com:24787',
    neo4j.auth.basic('Admin', 'b.alb8WEgmHbfh.tNCscxV1vZJHPGg7'));

module.exports = driver;
