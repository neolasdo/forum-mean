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
    group: {
        type: mongoose.Schema.ObjectId,
        ref: 'Group'
    },
    sessionId : {
        type: String,
        default: ''
    },
    token : {
        type: String,
        default: ''
    },
    startedAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    }
});

mongoose.model('Stream', StreamSchema);
