const mongoose = require('mongoose');

//connectie maken met mongoDB:
// Checken of de connectie gemaakt is door messages:
mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
    .once('open', () => console.log('Good to go'))
    .on('error', (error) =>{
        console.log('Warning', error);
    });
