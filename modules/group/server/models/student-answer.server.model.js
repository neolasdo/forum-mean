'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * StudentAnswer Schema
 */
var StudentAnswerSchema = new Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    assignment: {
        type: mongoose.Schema.ObjectId,
        ref: "Assignment"
    },
    answer: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now()
    },
    point: {
        type: Number,
        max: 10,
        min: 0,
        required: false
    }
});

mongoose.model('StudentAnswer', StudentAnswerSchema);
