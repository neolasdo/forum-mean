'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Topic Schema
 */
var TopicSchema = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group"
    },
    name: {
        type: String,
        required: "Vui lòng nhập tên chủ đề"
    },
    content: {
        type: String,
        minlength: 10
    },
    attach: {
        type: Schema.ObjectId,
        ref: "Document"
    },
    img: [{
        type: String,
    }],
    status: {
        type: Number,
        min: 0,
        max: 1,
        default: 1
    },
    comment: {
        type: Number,
        min: 0,
        max: 1,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Topic', TopicSchema);
