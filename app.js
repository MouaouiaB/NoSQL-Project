const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const routes = require('./src/routes/routes')

mongoose.Promise = global.Promise;
//connecten met de mongodb
mongoose.connect('mongodb://localhost:27017/studdit', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MongoDB connection established')
    })
    .catch(err => {
        console.log('MongoDB connection failed')
        console.log(err)
    });


app.use(bodyParser.json());
routes(app);

app.use((err, req, res, next) => {
    res.status(422).send({error: err.message})
})

module.exports = app;
