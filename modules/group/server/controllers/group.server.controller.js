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
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
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
exports.create = function (req, res) {

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
