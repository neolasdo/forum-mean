'use strict';

module.exports = function(app) {
    var groups = require('../controllers/group.server.controller');

    app.route('/api/groups/picture').post(groups.uploadPicture);
    app.route('/api/:role/:userId/groups/getAllJoined').get(groups.getAllJoined);
    app.route('/api/:role/:userId/groups/getAllByUser').get(groups.getAllByUser);
    app.route('/api/addGroup').post(groups.addGroup);
    app.route('/api/joinGroup').post(groups.joinGroup);
    app.route('/api/removeTeacher').post(groups.removeTeacher);
    app.route('/api/removeStudent').post(groups.removeStudent);
    app.route('/api/group/:id').get(groups.getById);
    app.route('/api/group/:id/user/:uid').get(groups.checkJoined);
    app.route('/api/group/:id/count').get(groups.count);
    app.route('/api/group/:id/students').get(groups.getListStudent);
    app.route('/api/group/:id/addStudents').post(groups.addStudents);
    app.route('/api/group/:id/teachers').get(groups.getListTeacher);
    app.route('/api/group/:id/addTeachers').post(groups.addTeachers);
    app.route('/api/group/find/:key').get(groups.findClass);
    app.route('/api/group/resetCode').put(groups.resetCode);
    app.route('/api/group/createTopic').post(groups.createTopic);
    app.route('/api/group/:id/topics').get(groups.getTopics);
    app.route('/api/topics/:topicId').get(groups.getTopic);
    app.route('/api/topic/hide').put(groups.hideTopic);
    // app.route('/api/topic/:id').get(groups.getTopic);
    app.route('/api/createComment').post(groups.createComment);
};
