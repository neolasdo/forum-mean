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
    Topic = mongoose.model('Topic'),
    Comment = mongoose.model('Comment'),
    GroupStudent = mongoose.model('GroupStudent'),
    GroupTeacher = mongoose.model('GroupTeacher'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 *
 * @param req
 * @param res
 */
exports.createComment = function (req, res) {
    var topicId = req.body.topicId;
    var userId = req.body.userId;
    var content = req.body.content;
    var comment = new Comment ({
        createdBy: userId,
        content: content,
        topic: topicId
    });

    comment.save(function (err, cmt) {
        if  (err)  return res.status(400).send({
            'status' : 'error',
            'message' : err
        });
        Topic.findById(topicId).exec(function (err, topic) {
            if (err)  return res.status(400).send({
                'status' : 'error',
                'message' : err
            });
            topic.comments.push(cmt._id);
            topic.save(function (err, done) {
                if (err)  return res.status(400).send({
                    'status' : 'error',
                    'message' : err
                });
                return res.json({'status' : 'success'});
            })
        })
    })
}
/**
 *
 * @param req
 * @param res
 */
exports.getTopics = function (req, res) {
    var groupId = req.params.id;

    if (groupId) {
        Topic.find({status: 1, group: groupId})
            .populate({path: 'comments', populate: { path: 'createdBy', select: { 'username': 1, 'displayName': 1, 'profileImageURL': 1}}})
            .populate('createdBy', 'username displayName profileImageURL').exec(function (err, topics) {
            if (err)  return res.status(400).send({
                'status' : 'error',
                'message' : err
            });

            return res.json({'status' : 'success', 'data' : topics});
        })
    }
}
/**
 *
 * @param req
 * @param res
 */
exports.getTopic = function (req, res) {
    var topicId = req.params.topicId;

    Topic.findOne({status: 1, _id: topicId})
        .populate({path: 'comments', populate: { path: 'createdBy', select: { 'username': 1, 'displayName': 1, 'profileImageURL': 1}}})
        .populate('createdBy', 'username displayName profileImageURL').exec(function (err, topic) {
        if (err)  return res.status(400).send({
            'status' : 'error',
            'message' : err
        });

        return res.json({'status' : 'success', 'data' : topic});
    })

}
/**
 *
 * @param req
 * @param res
 */
exports.hideTopic = function (req, res) {
    var id = req.body.id;

    Topic.findById(id).exec(function (err, topic) {
        if (err) return res.status(400).send({
            'status' : 'error',
            'message' : err
        });
        topic.set({status : 0});
        topic.save(function (err, updatedTopic) {
            if (err) return res.status(400).send({
                'status' : 'error',
                'message' : err
            });
            return res.json({'status' : 'success'});
        });
    })
}
/**
 *
 * @param req
 * @param res
 */
exports.createTopic = function (req, res) {
    var groupId = req.body.groupId;
    var topic = req.body.topic;
    var userId = req.body.user;

    if (groupId && topic.content) {
        var topic = new Topic({
            group: groupId,
            content: topic.content,
            comments: [],
            createdBy: userId
        });
        topic.save(function (err, topic) {
            if (err) return res.status(400).send({
                'status' : 'error',
                'message' : err
            });
            return res.json({'status' : 'success', 'data' : topic});
        })
    }
}
/**
 *
 * @param req
 * @param res
 */
exports.resetCode = function (req, res) {
    var groupId = req.body.groupId;

    Group.findById(groupId).exec(function (err, group) {
        if (err) return res.status(400).send({
            'status' : 'error',
            'message' : err
        });
        var code = group.generateRandomCode();
        group.set({secretCode : code});
        group.save(function (err, updatedGroup) {
            if (err) return res.status(400).send({
                'status' : 'error',
                'message' : err
            });
            return res.json({'status' : 'success', 'data' : updatedGroup});
        });
    })
}
/**
 *
 * @param req
 * @param res
 */
exports.getAllJoined = function (req, res) {
    var userId = req.params.userId;
    var role = req.params.role;
    if (role == 'student') {
        GroupStudent.find({student : userId}).populate('group').select({secretCode: false}).exec(function (err, grs) {
            if (err) return res.status(400).send({
               'message' : err,
                'status' : 'error'
            });
            return res.json({status:'success', 'data': grs.group});
        })
    }
    if (role == 'teacher') {
        GroupTeacher.find({teacher : userId}).populate('group').select({secretCode: false}).exec(function (err, grs) {
            if (err) return res.status(400).send({
                'message': err,
                'status' : 'error'
            });
            return res.json({status:'success', 'data': grs.group});
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
    Group.find({createdBy: userId}).select({secretCode: false}).exec(function (err, grs) {
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

    group.save(function (err) {
        if (err){
            return res.status(400).send({
                message: "Không thể tạo lớp mới"
            })
        } else {
            // GroupTeacher({group: group._id, teacher: req.body.createdBy}).save(function (err) {
            //     console.log(err);
            // })
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
