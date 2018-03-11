'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Report Schema
 */
var ReportSchema = new Schema({
    teacher: {
        type: Schema.ObjectId,
        ref: "User"
    },
    student: {
        type: Schema.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        default: ''
    },
    group: {
        type: Schema.ObjectId,
        ref: "Group"
    },
    status: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    teacherArchive: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    studentArchive: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    visiable: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Report', ReportSchema);
