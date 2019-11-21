const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    thread: [{ type: Schema.Types.ObjectId, ref: 'thread'}],
    friendship: [{ type: Schema.Types.ObjectId, ref: 'user'}]
});
// connect/ koppel met mongoose, zodat mongo kan checken of user al bestaat, als niet dan wordt er een collection gemaakt van users door gebruik te maken van de schema:
const User = mongoose.model('user', UserSchema);
// Export model/ schema:
module.exports = User;
