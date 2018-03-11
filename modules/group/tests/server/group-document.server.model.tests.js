'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  GroupDocument = mongoose.model('GroupDocument');

/**
 * Globals
 */
var user,
  groupDocument;

/**
 * Unit tests
 */
describe('Group document Model Unit Tests:', function() {
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
      groupDocument = new GroupDocument({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return groupDocument.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    GroupDocument.remove().exec();
    User.remove().exec();

    done();
  });
});
