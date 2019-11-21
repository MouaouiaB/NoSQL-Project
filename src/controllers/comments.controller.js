const Thread = require('../models/thread');
const Comment = require('../models/comment');
const User = require('../models/user');


module.exports = {

   //Toevoegen van nieuwe comment aan een thread:
    createComment(req, res, next) {
        const embeddedComment = new Comment(req.body);
        Thread.findById({ _id: req.params.threadid })
            .then(thread => {
                thread.comments.push(embeddedComment);
                return thread.save(embeddedComment);
            })
            .then(() =>
                res.json({
                    message:'The comment is saved'
                }))
            .catch(next);
    },
    //Het verwijderen van een comment door Id:
    deleteComment(req, res, next) {
        Thread.findByIdAndDelete(
            { _id: req.params.threadid },
            { $pull: { comments: { _id: req.params.commentid } } }
        )
            .then(thread =>
                res.status(204).json({
                    message: 'The comment is deleted'
                }))
            .catch(next);
    }
}
