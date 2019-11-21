const Thread = require('../models/thread');
const logger = require("../config/appconfig").logger;

module.exports = {
    
    //Toevoegen van nieuwe comment aan een thread: 
    createComment(req, res, next){
        const comment = req.body;
        Thread.findById({ _id: req.params.id })
            .then(thread => {
                if(thread === null){
                    res.status(404).send({error : 'This thread does not exist'})
                }
                else{
                thread.comments.push(comment);
                return thread.save();
            }
            })
            .then(() => res.status(200).send(comment))
            .catch(next);
    },

    //Het verwijderen van een comment door Id:
    deleteComment(req, res, next) {
        Thread.findByIdAndUpdate(
            { _id: req.params.threadId },
            { $pull: { comments: { _id: req.body.id } } } 
        )
        .then(comment => res.status(200).send(comment))
        .catch(next);
    }
}

