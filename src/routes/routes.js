//import de controllers:
const UsersController = require('../controllers/users.controller');
const FriendshipsController = require('../controllers/friendships.controller');
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
    app.post('/api/friendships', FriendshipsController.createFriendship);
    app.delete('/api/friendships', FriendshipsController.deleteFriendship);

    //todo: Comment routes:
    app.post('/api/threads/:threadid/comments', CommentsController.createComment);

    //todo: Thread routes:
    app.post('/api/threads', ThreadsController.createThread);
    app.get('/api/threads/:threadid', ThreadsController.getThreadById);
    app.get('/api/threads', ThreadsController.getAllThreads);
    app.put('/api/threads/:threadid', ThreadsController.editThread);
    app.delete('/api/users/:userid/threads/:threadid', ThreadsController.deleteThread);


};
