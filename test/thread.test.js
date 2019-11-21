// const assert = require('assert');
// const mongoose = require('mongoose');
// const app = require('../app');

// const User = mongoose.model('user');
// const Thread = mongoose.model('thread');

// describe('Thread controller', () => {
//     it('POST, creating a new thread.', done => {
//         Thread.countDocuments().then(count => {
//             request(app)
//                 .post('/api/threads')
//                 .send({ userName: 'jazzwalter', title: 'Test', content: 'Test', upVote: 0, downVote: 0 })
//                 .end(() => {
//                     Thread.countDocuments().then(newCount => {
//                         assert(count + 1 === newCount);
//                         done();
//                     });
//                 });
//         });
//     });
// });