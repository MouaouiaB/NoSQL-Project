const mongoose = require('mongoose');

//connectie maken met mongoDB:
// Checken of de connectie gemaakt is door messages:
mongoose.connect('mongodb+srv://Studdit:Mouaouia-881998@studdit-project-yjang.mongodb.net/studdit', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection
    .once('open', () => console.log('Good to go'))
    .on('error', (error) =>{
        console.log('Warning', error);
    });
