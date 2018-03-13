'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
    groupName: {
        type: String,
        unique: "Tên lớp đã tồn tại",
        required: "Tên lớp không thể bỏ trống"
    },
    secretCode: {
        type: String,
        maxlength: 6,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    image: {
        type: String,
        default: 'modules/group/client/img/profile/default.png'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    information: {
        type: String
    }
});

GroupSchema.pre('save', function(next){
    this.secretCode = this.generateRandomCode();
    next();
});
GroupSchema.methods.generateRandomCode = function(){
    return Math.random().toString(36).substring(7).toUpperCase()
}
mongoose.model('Group', GroupSchema);
