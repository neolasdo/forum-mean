'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multi_choice' ,'text' , 'pick_one', 'true/false'],
        default: 'text'
    },
    answers: [{
        type: String,
        default: ''
    }],
    correctAnswer: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }
});

mongoose.model('Question', QuestionSchema);
