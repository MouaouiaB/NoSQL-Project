const Thread = require('../models/thread'); 
const User = require('../models/user');

module.exports = {

    //Threads toevoegen
    createThread(req, res, next) {
        const thread = new Thread({userName: req.body.userName,title: req.body.title, content: req.body.content});
    
        Thread.create(thread)
            .then(() => User.findOne({ userName: req.body.userName }))
            .then(user => {
                user.threads.push(thread._id);
                return user.save();
            })
            .then(() => res.send(thread))
            .catch(next);
    },

    //Thread opvragen aan de hand van een id
    getThreadById(req, res, next) {
        Thread.findById({ _id: req.params.threadid })
            .then(thread => {
                if(thread === null){
                    res.status(404).send({ Error: 'Thread does not exist'});
                }
                else{
                    items ={
                    _id: thread._id,
                    title: thread.title,
                    userName: thread.userName,
                    content: thread.content,
                    upVote: thread.upVote,
                    downVote: thread.downVote,
                    comments: thread.comments 
                    };
                    res.status(200).send(items);
                }
            })
        .catch(next);
    },

    //Alle threads opvragen
    getAllThreads(req, res, next) {
        const tList = [];
        Thread.find({})
            .then(threads => {
                threads.forEach(thread=>{
                    items = {
                    _id: thread._id,
                    title: thread.title,
                    userName: thread.userName,
                    content: thread.content,
                    upVote: thread.upVote,
                    downVote: thread.downVote                 
                    }
                    tList.push(items);

                })
                res.status(200).send(tList);
            })
            .catch(next);
    },

    //Content aanpassen door id
    editThread(req, res, next) {
        if(req.body.content != null) {
            Thread.findByIdAndUpdate(
                { _id: req.params.threadid },
                { $set: { content: req.body.content } }
            )
            .then(() => Thread.findById({ _id: req.params.threadid }))
            .then(thread => res.send(thread))
            .catch(next);
        } else {
            res.status(422).send({ error: 'Only the content can be modified.' });
        }
    },

    //Verwijderen van threads met alle comments...
    deleteThread(req, res, next) {
        User.findByIdAndUpdate(
            { _id: req.params.userid },
            { $pull: { threads: req.params.threadid } } 
        )
        .then(() => Thread.findByIdAndDelete({ _id: req.params.threadid }))
        .then(thread => res.status(200).send(thread))
        .catch(next);
    },



}
