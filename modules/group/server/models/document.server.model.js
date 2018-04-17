'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Document Schema
 */
var DocumentSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'modules/group/client/img/document/default.jpeg'
    },
    group: {
        type: Schema.ObjectId,
        ref: "Group"
    },
    uploadBy: {
        type: Schema.ObjectId,
        ref: "User"
    },
    uploadAt: {
        type: Date,
        default: Date.now()
    },
    desc: {
        type: String,
        default: ''
    }
});

mongoose.model('Document', DocumentSchema);
