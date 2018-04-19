'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    config = require(path.resolve('./config/config')),
    df = require(path.resolve('./config/env/default')),
    multer = require('multer'),
    fs = require('fs'),
    Group = mongoose.model('Group'),
    Topic = mongoose.model('Topic'),
    Comment = mongoose.model('Comment'),
    Assignment = mongoose.model('Assignment'),
    Question = mongoose.model('Question'),
    Stream = mongoose.model('Stream'),
    StudentAnswer = mongoose.model('StudentAnswer'),
    Document = mongoose.model('Document'),
    GroupStudent = mongoose.model('GroupStudent'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    OpenTok = require('opentok'),
    opentok = new OpenTok(df.openTokApi, df.openTokSecret),
    _ = require('lodash');

/**
 *
 * @param req
 * @param res
 */
exports.createSession = function(req, res) {
    var gid = req.body.gid;
    opentok.createSession(function(err, session) {
        if (err) return res.status(400).send({
            'status' : 'error',
            'data' : err
        });
        Stream.find({group: gid}).remove().exec();
        var token = session.generateToken();
        var stream = new Stream({group: gid, sessionId: session.sessionId, token: token, status: 1});

        stream.save(function (err, data) {
            if (err) return res.status(400).send({
                'status' : 'error',
                'data' : err
            })
            return res.json({
                'status' : 'success',
                'session' : session,
                'token' : token,
                'data' : data
            })
        })
    });
}
exports.stopSession = function(req, res) {
    var sid = req.body.sid;

    Stream.findOneAndRemove({_id: sid}).exec(function (err, str) {
        if (err) return res.status(400).send({
            'status' : 'error',
            'data' : err
        })
        return res.json({
            'status' : 'success'
        })
    })
}
exports.getStream = function (req, res) {
    var id = req.params.id;

    Stream.findOne({group: id, status: 1}, function (err, stream) {
        if (err) return res.status(400).send({
            'status' : 'error',
            'data' : err
        })
        else return res.json({
            'status' : 'success',
            'data' : stream
        })
    })
}
exports.createComment = function (req, res) {
    var topicId = req.body.topicId;
    var groupId = req.body.groupId;
    var content = req.body.content;
    var comment = new Comment ({
        groupId: groupId,
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
exports.createAssignment = function (req, res) {
    var data = req.body.assignment;
    var questions = data.questions;

    var promises = questions.map(function (question) {
        return new Promise(function (resolve, reject) {
            var ques = new Question(question);
            ques.save(function (err, q) {
                if (err) reject(err);
                resolve(q._id);
            })
        });
    });
    Promise.all(promises).then(function(ids){
        var assignment = new Assignment({
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            groupId: data.groupId,
            title: data.title,
            questions: ids
        });
        assignment.save(function (err, value) {
            if (err) return res.status(400).send({
                'status' : 'error',
                'message' : err
            });
            return res.json({
                'status' : 'success',
                'data' : value
            })
        });
    }).catch(function(err){
        return res.status(400).send({
            'status' : 'error',
            'message' : err
        });
    });
}
exports.getAssignments = function(req, res) {
    var groupId = req.params.id;

    Assignment.find({status: 1, groupId: groupId})
        .populate({path: 'questions'})
        .exec(function (err, collection){
            if (err)  return res.status(400).send({
                'status' : 'error',
                'message' : err
            });
            return res.json({
                'status': 'success',
                'data': collection
            });
        });
}
exports.deleteAssignment = function (req, res) {
    var id = req.params.id;
    Assignment.remove({_id: id} ,function (err) {
        if (err)  return res.status(400).send({
            'status' : 'error',
            'message' : err
        });
        return res.json({'status': 'success'})
    });
}
exports.updateAssignment = function (req, res) {
    var id = req.params.id;
    var data = req.body.assignment;
    var promises = data.questions.map(function (question) {
        return new Promise(function (resolve, reject) {
            if (question._id){
                Question.findOneAndUpdate({_id: question._id}, question, function(err, ques){
                    if (err) reject(err);
                    resolve(ques._id);
                })
            }
            else {
                var ques = new Question(question);
                ques.save(function (err, q) {
                    if (err) reject(err);
                    resolve(q._id);
                })
            }
        });
    });
    Promise.all(promises).then(function (val) {
        Assignment.findOneAndUpdate({_id: id},
            {$set: {
                        name: data.name,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        questions: val,
                        title: data.title,
                    }
            }, function (err, value) {
                if (err) return res.status(400).send({
                    'status' : 'error',
                    'message' : err
                });
                return res.json({
                    'status' : 'success',
                    'data' : value
                })
            });
    }).catch(function (err) {
        return res.status(400).send({
            'status' : 'error',
            'message' : err
        });
    });

}
exports.deleteQuestion = function (req, res) {
    var id = req.params.id;
    Question.findOneAndRemove({_id: id}, function (err, ques) {
        if (err) return res.status(400).send({
            'status' : 'error',
            'message' : err
        });
        return res.json({'status' : 'success'});
    })
}
exports.getActiveAssignments = function (req, res) {
    var groupId = req.params.id;

    Assignment.find(
        {
            groupId : groupId,
            status: 1,
            startDate:{
                $lte: Date.now()
            },
            endDate:{
                $gte: Date.now()
            }
        })
        .populate({path: 'questions', select: { 'question': 1, 'answers': 1, 'type': 1}})
        .exec(function (err, collection){
        if (err)  return res.status(400).send({
            'status' : 'error',
            'message' : err
        });
        return res.json({
            'status': 'success',
            'data': collection
        });
    })
}
exports.getAnswersById = function (req,res) {
    var uid = req.params.uid;

    StudentAnswer.find({student: uid}).exec(function (err, data) {
        if (err) return res.status(400).send({
            'status': 'fail',
            'data': err
        });
        return res.json({
            'status' : 'success',
            'data' : data
        })
    })
}
exports.getStudentAnswers = function (req, res) {
    var uid = req.params.uid;
    var aid = req.params.aid;

    StudentAnswer.findOne({student: uid, assignment: aid}).exec(function (err, data) {
        if (err) return res.status(400).send({
            'status': 'fail',
            'data': err
        });
        return res.json({
            'status' : 'success',
            'data' : data
        })
    })
}
exports.createStudentAnswers = function (req, res) {
    var answer = req.body.answer;

    var studentAnswer = new StudentAnswer(answer);

    studentAnswer.save(function (err, val) {
        if (err) return res.status(400).send({
            'status': 'fail',
            'data': err
        });
        return res.json({
            'status' : 'success',
            'data' : val
        })
    })
}
exports.getAssignmentAnswers = function (req, res) {
    var aid = req.params.aid;

    StudentAnswer.find({assignment: aid}).exec(function (err, data) {
        if (err) return res.status(400).send({
            'status': 'fail',
            'data': err
        });
        return res.json({
            'status' : 'success',
            'data' : data
        })
    })
}
exports.getAnswers = function (req, res) {
    StudentAnswer.find({})
        .populate({path: 'student', select: { 'username': 1, 'displayName': 1, 'profileImageURL': 1}})
        .populate({path: 'assignment', select: { 'name': 1, 'title' : 1}})
        .exec(function (err, data) {
        if (err) return res.status(400).send({
            'status': 'fail',
            'data': err
        });
        return res.json({
            'status' : 'success',
            'data' : data
        })
    })
}
exports.answerPoint = function (req, res) {

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
exports.findClass = function (req, res) {
    var key = req.params.key;
    Group.find({groupName:{$regex: new RegExp(key, "i")}}).select({secretCode: false}).exec(function(err, groups) {
        if (err) return res.status(400).send({status: 'error',message: err});
        return res.json({status: 'success', 'data' : groups});
    });
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

    Group.findById(groupId).populate({
        path: 'createdBy',
        select: {password:0, salt: 0}
    }).exec(function (err, group) {
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

    Group.findById(groupId).populate({
        path: 'createdBy',
        select: {password:0, salt: 0}
    }).exec(function (err, grp) {
        if (err) return res.status(400).send({status: 'error',message: err});
        return res.json({status: 'success', 'data' : grp});
    })
}
/**
 * check join group
 * @param req
 * @param res
 */
exports.checkJoined = function (req, res) {
    var groupId = req.params.id;
    var uid = req.params.uid;

    Group.findById(groupId).exec(function (err, grp) {
        if (err) return res.status(400).send({status: 'error',message: err});
        else {
            if (grp.createdBy != uid) {
                GroupStudent.find({group:groupId, student:uid}).exec(function(err, gs){
                    if (err) return res.status(400).send({status: 'error',message: err});
                    if (gs.length > 0) return res.json({'status' : 'success'});
                })
            }
            if (grp.createdBy == uid) return res.json({'status' : 'success'});
        }
    })
}
/**
 * join group by id
 * @param req
 * @param res
 */
exports.joinGroup = function (req, res) {
    var groupId = req.body.id;
    var code = req.body.code;
    var userId = req.body.userId;

    Group.findById(groupId).exec(function (err, grp) {
        if (err) return res.status(400).send({status: 'error',message: err});
        if(grp.secretCode == code) {
            var groupStudent = new GroupStudent({group: groupId, student: userId});
            groupStudent.save(function (err, gs) {
                if (err) return res.status(400).send({
                    message: "Có lỗi"
                });
                return res.json({
                    'status' : 'success',
                    'data': gs
                });
            });
        } else {
            return res.json({
                'status' : 'wrong',
            });
        }
    })
}
/**
 *
 * @param req
 * @param res
 */
exports.saveDocument = function (req, res) {
    var message = null;
    var upload = multer(config.uploads.groupDocument).single('newGroupDocument');
    var groupUploadDocumentFilter = require(path.resolve('./config/lib/multer')).documentUploadFileFilter;

    upload.fileFilter = groupUploadDocumentFilter;

    upload(req, res, function (uploadError) {
        if(uploadError) {
            return res.status(400).send({
                message: uploadError
            });
        } else {
            var documentUrl = config.uploads.groupDocument.dest + req.file.filename;
            res.json(documentUrl);
        }
    });
}
exports.uploadDocument = function (req, res) {
    var fileUrl = req.body.file;
    var info = req.body.info;
    var uid = req.body.uid;
    var gid = req.body.gid;

    var document = new Document({
        name: info.name,
        url: fileUrl,
        group: gid,
        uploadBy: uid,
        desc: info.desc
    })

    document.save(function (err, document) {
        if(err) {
            return res.status(400).send({
                'status': 'error',
                'message': err
            });
        }
        else {
            return res.json({
                'status' : 'success',
                'data' : document
            });
        }
    })
}
exports.getDocuments = function(req, res) {
    var gid = req.params.id;

    Document.find({group: gid}).exec(function(err, collection) {
        if(err) {
            return res.status(400).send({
                'status': 'error',
                'message': err
            });
        }
        else {
            return res.json({
                'status' : 'success',
                'data' : collection
            });
        }
    });
}
/**
 *
 * @param req
 * @param res
 */
exports.removeStudent = function (req, res) {
    var gid = req.body.id;
    var uid = req.body.uid;

    GroupStudent.remove({group: gid, student: uid}, function (err) {
        if (err) return res.status(400).send({message: "Có lỗi"});
        return res.json({'status' : 'success'});
    });
}
/**
 * count group by id
 * @param req
 * @param res
 */
exports.count = function (req, res) {
    var groupId = req.params.id;
    if (groupId) {
        var count = {};
        GroupStudent.find({group:groupId}).populate({
            path: 'student',
            select: {password:0, salt: 0}
        }).exec(function(err, students){
            if (err) return res.status(400).send({status: 'error',message: err});
            count.students= students.length;
            Topic.find({status: 1, group: groupId}).populate('comments').exec(function (err, topics) {
                if (err)  return res.status(400).send({'status' : 'error', 'message' : err});
                if(topics.length){
                    count.comments = 0;
                    topics.forEach(function (item) {
                        count.comments += item.comments.length;
                    })
                }
                count.topics= topics.length;
                Assignment.find({status: 1, groupId: groupId}).exec(function(err, assignments){
                    if (err)  return res.status(400).send({'status' : 'error', 'message' : err});
                    if(assignments.length){
                        count.assignments = assignments.length;

                        return res.json({
                            'status' : 'success',
                            'data': count
                        });
                    }
                })
            });
        })
    }
}
/**
 * get group by id
 * @param req
 * @param res
 */
exports.getListStudent = function (req, res) {
    var groupId = req.params.id;

    GroupStudent.find({group:groupId}).populate({
        path: 'student',
        select: {password:0, salt: 0}
    }).exec(function(err, students){
        if (err) return res.status(400).send({status: 'error',message: err});
        return res.json({status: 'success', 'data' : students});
    })
}

/**
 * get group by id
 * @param req
 * @param res
 */
exports.addStudents = function (req, res) {
    var groupId = req.params.id;
    var students = req.body.students;
    if (students) {
        students.forEach(function (item) {
            var groupStudent = new GroupStudent({group: groupId, student: item._id});
            groupStudent.save(function (err) {
                if (err) return res.status(400).send({
                    message: "Có lỗi khi thêm học sinh vào lớp"
                });
                return res.json({
                    'status' : 'success',
                });
            });
        });
    }
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
            return res.json(groupImageUrl);
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
            var promises = [];
            var syncMember = function () {
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
            }
            promises.push(syncMember());
            Promise.all(promises).then(function() {
                return res.json({
                    'status' : 'success',
                    'group': group
                });
            }).catch(function (err){
                return res.status(400).send({
                    message: "Lỗi khi thêm thành viên"
                })
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
