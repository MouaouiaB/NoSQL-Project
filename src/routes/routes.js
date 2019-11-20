//import de controllers:
const UsersController = require('../controllers/users.controller');
const CommentsController = require('../controllers/comments.controller');
const ThreadsController = require('../controllers/threads.controller');

//Hier komen te routes/ endpoints:
//callback ()=>{...};
module.exports = (app) => {
    //todo: User routes:
    app.post('/api/users', UsersController.createUser);
    app.put('/api/users', UsersController.updateUser);
    app.delete('/api/users', UsersController.deleteUser);

    //todo: Friendship routes:
    
    //todo: Comment routes:

    //todo: Thread routes:

};
