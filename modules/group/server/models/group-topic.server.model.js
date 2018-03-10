'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * GroupTopic Schema
 */
var GroupTopicSchema = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group"
    },
    topic: {
        type: Schema.ObjectId,
        ref: "Topic"
    }
});

mongoose.model('GroupTopic', GroupTopicSchema);
