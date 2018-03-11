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
        required: "Bạn phải nhập url cho tài liệu"
    },
    status: {
        type: String,
        enum: ['public', 'private', 'hide'],
        default: 'private'
    },
    image: {
        type: String,
        default: 'modules/group/client/img/document/default.jpeg'
    }

});

mongoose.model('Document', DocumentSchema);
