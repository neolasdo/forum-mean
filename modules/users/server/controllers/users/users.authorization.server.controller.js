'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * get all teachers
 */
exports.getAllTeacher = function(req, res){
    User.find({
        roles : "teacher"
    }).select({"_id" : 1, "displayName": 1, "email": 1}).exec(function (err, list) {
        if (err) {
            res.status(500).jsonp(err);
        } else if (!list) {
            res.send("Danh sách giáo viên trống");
        }
        res.json(list);
    });
}
/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findOne({
    _id: id
  }).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load User ' + id));
    }

    req.profile = user;
    next();
  });
};
