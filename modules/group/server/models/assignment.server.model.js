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
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: Number,
        max: 1,
        min: 0,
        default: 1
    },
    question: [{
        type: mongoose.Schema.ObjectId,
        ref: "Question"
    }]
});

mongoose.model('Assignment', AssignmentSchema);
