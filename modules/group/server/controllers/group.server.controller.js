'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    config = require(path.resolve('./config/config')),
    multer = require('multer'),
    fs = require('fs'),
    Group = mongoose.model('Group'),
    GroupStudent = mongoose.model('GroupStudent'),
    GroupTeacher = mongoose.model('GroupTeacher'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 *
 * @param req
 * @param res
 */
exports.getAllJoined = function (req, res, next) {
    var userId = req.params.userId;
    var role = req.params.role;

};
/**
 *
 * @param req
 * @param res
 */
exports.getAllByUser = function (req, res, next) {
    var userId = req.params.userId;

};
/**
 * upload picture
 */
exports.uploadPicture = function (req, res) {
    var message = null;
    var upload = multer(config.uploads.groupUpload).single('newGroupPicture');
    var groupUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

    // Filtering to upload only images
    upload.fileFilter = groupUploadFileFilter;

    upload(req, res, function (uploadError) {
        if(uploadError) {
            return res.status(400).send({
                message: 'Bạn chỉ có thể dùng ảnh có kích cỡ < 5Mb'
            });
        } else {
            var groupImageUrl = config.uploads.groupUpload.dest + req.file.filename;
            res.json(groupImageUrl);
        }
    });
}
/**
 * Create a Group
 */
exports.addGroup = function (req, res) {
    var group = new Group(req.body);

    var teachers = req.body.teachers;
    var students = req.body.students;
    group.save(function (err) {
        if (err){
            return res.status(400).send({
                message: "Không thể tạo lớp mới"
            })
        } else {
            if (teachers) {
                teachers.forEach(function (item) {
                    var groupTeacher = new GroupTeacher({group: group._id, teacher: item._id});
                    groupTeacher.save(function (err) {
                        if (err) return res.status(400).send({
                            message: "Có lỗi khi thêm giáo viên vào lớp"
                        });
                    });
                });
            }
            if (students) {
                students.forEach(function (item) {
                    var groupStudent = new GroupStudent({group: group._id, student: item._id});
                    groupStudent.save(function (err) {
                        if (err) return res.status(400).send({
                            message: "Có lỗi khi thêm học sinh vào lớp"
                        });
                    });
                });
            }
            return res.json({
                'status' : 'success',
                'group': group
            });
        }
    })
};

/**
 * Show the current Group
 */
exports.read = function (req, res) {

};

/**
 * Update a Group
 */
exports.update = function (req, res) {

};

/**
 * Delete an Group
 */
exports.delete = function (req, res) {

};

/**
 * List of Groups
 */
exports.list = function (req, res) {

};
