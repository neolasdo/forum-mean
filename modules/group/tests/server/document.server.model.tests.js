'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Document = mongoose.model('Document');

/**
 * Globals
 */
var user,
  document;

/**
 * Unit tests
 */
describe('Document Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      document = new Document({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return document.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Document.remove().exec();
    User.remove().exec();

    done();
  });
});
