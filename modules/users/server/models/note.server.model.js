'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Note Schema
 */
var NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        enum: ["topic", "document", "text"],
        default: "text"
    },
    topic: {
        type: Schema.ObjectId,
        ref: "Topic"
    },
    document: {
        type: Schema.ObjectId,
        ref: "Document"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Note', NoteSchema);
