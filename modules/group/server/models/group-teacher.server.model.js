'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * GroupTeacher Schema
 */
var GroupTeacherSchema = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group"
    },
    teacher: {
        type: Schema.ObjectId,
        ref: "User"
    },
    sessionId: {
        type: Number
    }
});

mongoose.model('GroupTeacher', GroupTeacherSchema);
