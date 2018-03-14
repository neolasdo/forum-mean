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
exports.getAllJoined = function (req, res) {
    var userId = req.params.userId;
    var role = req.params.role;
    if (role == 'student') {
        GroupStudent.find({student : userId}).populate('group').exec(function (err, grs) {
            if (err) return res.status(400).send({
               'message' : err,
                'status' : 'error'
            });
            return res.json({status:'success', 'data': grs});
        })
    }
    if (role == 'teacher') {
        GroupTeacher.find({teacher : userId}).populate('group').exec(function (err, grs) {
            if (err) return res.status(400).send({
                'message': err,
                'status' : 'error'
            });
            return res.json({status:'success', 'data': grs});
        })
    }
};
/**
 * get group by id
 * @param req
 * @param res
 */
exports.getById = function (req, res) {
    var groupId = req.params.id;

    Group.findById(groupId).exec(function (err, grp) {
        if (err) return res.status(400).send({status: 'error',message: err});
        return res.json({status: 'success', 'data' : grp});
    })
}
/**
 *
 * @param req
 * @param res
 */
exports.getAllByUser = function (req, res) {
    var userId = req.params.userId;
    Group.find({createdBy: userId}).exec(function (err, grs) {
        if (err) return res.status(400).send({
            'message': err,
            'status' : 'error'
        });
        return res.json({status:'success', 'data': grs});
    })
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
    if (req.body.createdBy) {
        var groupTeacher = new GroupTeacher({group: group._id, teacher: createdBy});
        groupTeacher.save(function (err) {
            if (err) return res.status(400).send({
                message: "Có lỗi khi thêm giáo viên vào lớp"
            });
        });
    }
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
