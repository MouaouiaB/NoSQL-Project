const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const routes = require('./src/routes/routes')
const port  = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
//connecten met de mongodb
mongoose.connect('mongodb+srv://Studdit:Mouaouia-881998@studdit-project-yjang.mongodb.net/studdit', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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

app.listen(port, '0.0.0.0', () => console.log(`Welcome to the app, use port ${port} for access.`));

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason.stack);
  // application specific logging, throwing an error, or other logic here
});

module.exports = app;
