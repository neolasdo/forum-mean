'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  GroupTeacher = mongoose.model('GroupTeacher');

/**
 * Globals
 */
var user,
  groupTeacher;

/**
 * Unit tests
 */
describe('Group teacher Model Unit Tests:', function() {
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
      groupTeacher = new GroupTeacher({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return groupTeacher.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    GroupTeacher.remove().exec();
    User.remove().exec();

    done();
  });
});
