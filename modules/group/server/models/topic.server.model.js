'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Comment = mongoose.model('Comment'),
  Schema = mongoose.Schema;

/**
 * Topic Schema
 */
var TopicSchema = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group"
    },
    like: {
        type: Number,
        min: 0,
        default: 0
    },
    content: {
        type: String,
        minlength: 20
    },
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
    createdBy:{
        type:  Schema.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    comments: [{
        type: Schema.ObjectId,
        ref: "Comment"
    }]
});

mongoose.model('Topic', TopicSchema);
