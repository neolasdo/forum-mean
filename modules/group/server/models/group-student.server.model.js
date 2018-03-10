'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * GroupStudent Schema
 */
var GroupStudentSchema = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group"
    },
    student: {
        type: Schema.ObjectId,
        ref: "User"
    },
    point: {
        type: Number,
        min: 0,
        max: 10
    }
});

mongoose.model('GroupStudent', GroupStudentSchema);
