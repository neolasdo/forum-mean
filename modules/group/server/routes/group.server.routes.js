'use strict';

module.exports = function(app) {
    var groups = require('../controllers/group.server.controller');

    app.route('/api/groups/picture').post(groups.uploadPicture);
    app.route('/api/:role/:userId/groups/getAllJoined').get(groups.getAllJoined);
    app.route('/api/:role/:userId/groups/getAllByUser').get(groups.getAllByUser);
    app.route('/api/addGroup').post(groups.addGroup);
    app.route('/api/group/:id').get(groups.getById);
};
