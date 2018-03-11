'use strict';

module.exports = function(app) {
    var groups = require('../controllers/group.server.controller');

    app.route('/api/groups/picture').post(groups.uploadPicture);
};
