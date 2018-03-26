'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  StudentAnswer = mongoose.model('StudentAnswer');

/**
 * Globals
 */
var user,
  studentAnswer;

/**
 * Unit tests
 */
describe('Student answer Model Unit Tests:', function() {
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
      studentAnswer = new StudentAnswer({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return studentAnswer.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    StudentAnswer.remove().exec();
    User.remove().exec();

    done();
  });
});
