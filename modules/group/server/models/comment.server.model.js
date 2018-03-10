'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Topic = mongoose.model('Topic');

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group",
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: "User",
    },
    like: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        default: "",
        required: "Nội dung không được bỏ trống"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    topic: {
        type: Schema.ObjectId,
        ref: "Topic"
    }
});

mongoose.model('Comment', CommentSchema);
