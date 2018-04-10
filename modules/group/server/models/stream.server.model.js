'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stream Schema
 */
var StreamSchema = new Schema({
    title: {
        type: String,
        default: ''
    },
    streamer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.ObjectId,
        ref: 'Group'
    },
    sessionId : {
        type: String,
        default: ''
    },
    startedAt: {
        type: Date,
        default: Data.now()
    },
    status: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    }
});

mongoose.model('Stream', StreamSchema);
