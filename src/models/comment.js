const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema ({
    commentid: {type: Number, required: true, unique: true},
    userName: {type: Schema.Types.ObjectId, ref:'user'},
    content: {type: String, required: true}
});
// connect/ koppel met mongoose, zodat mongo kan checken of comment al bestaat, als niet dan wordt er een collection gemaakt van comments door gebruik te maken van de schema:
//const Comment = mongoose.model('comment', CommentSchema);
// Export model/ schema:
module.exports = CommentSchema;
