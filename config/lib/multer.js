'use strict';

module.exports.profileUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

module.exports.documentUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'application/msword'
      && file.mimetype !== 'application/json'
      && file.mimetype !== 'application/vnd.ms-powerpoint'
      && file.mimetype !== 'application/pdf'
      && file.mimetype !== 'text/css'
      && file.mimetype !== 'application/vnd.ms-fontobject'
      && file.mimetype !== 'text/html'
      && file.mimetype !== 'application/java-archive'
      && file.mimetype !== 'application/javascript'
      && file.mimetype !== 'application/x-rar-compressed'
      && file.mimetype !== 'application/typescript'
      && file.mimetype !== 'application/zip'
      && file.mimetype !== 'application/vnd.ms-excel'
      && file.mimetype !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      && file.mimetype !== 'text/csv'
      && file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return cb(new Error('Only documents files are allowed!'), false);
  }
  cb(null, true);
};
