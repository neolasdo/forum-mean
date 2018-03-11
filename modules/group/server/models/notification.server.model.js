'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group"
    },
    title: {
        type: String,
        default: "Thông báo",
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: "User"
    },
    readed: [{
        type: Schema.ObjectId,
        ref: "User"
    }],
    content: {
        type: String,
        required: "Bạn phải nhập nội dung thông báo"
    },
    status: {
        type: Number,
        min: 0,
        max: 1,
        default: 1
    },
    deleteBy: [{
        type: Schema.ObjectId,
        ref: "User"
    }]

});

mongoose.model('Notification', NotificationSchema);
