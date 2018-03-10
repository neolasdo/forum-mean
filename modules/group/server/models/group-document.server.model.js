'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * GroupDocument Schema
 */
var GroupDocumentSchema = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group"
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

mongoose.model('GroupDocument', GroupDocumentSchema);
