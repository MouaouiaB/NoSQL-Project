const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// import Schema's:
const CommentSchema = require('./comment')

const ThreadSchema = new Schema ({

    threadid: {type: Number, required: true, unique: true},
    userName: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true}, 
    upVote: { type: Number},
    downVote: { type: Number},
    comments:[{CommentSchema}]
    //comments:[{type: Schema.Types.ObjectId, ref: 'Comment'}]
});
// connect/ koppel met mongoose, zodat mongo kan checken of thread al bestaat, als niet dan wordt er een collection gemaakt van threads door gebruik te maken van de schema:
const Thread = mongoose.model('thread', ThreadSchema);
// Export model/ schema:
module.exports = Thread;
