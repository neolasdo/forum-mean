'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Assignment Schema
 */
var AssignmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
        required: true
    },
    groupId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Group'
    },
    status: {
        type: Number,
        max: 1,
        min: 0,
        default: 1
    },
    questions: [{
        type: mongoose.Schema.ObjectId,
        ref: "Question"
    }]
});

mongoose.model('Assignment', AssignmentSchema);
