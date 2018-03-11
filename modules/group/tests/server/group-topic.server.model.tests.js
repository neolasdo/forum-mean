'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  GroupTopic = mongoose.model('GroupTopic');

/**
 * Globals
 */
var user,
  groupTopic;

/**
 * Unit tests
 */
describe('Group topic Model Unit Tests:', function() {
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
      groupTopic = new GroupTopic({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return groupTopic.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    GroupTopic.remove().exec();
    User.remove().exec();

    done();
  });
});
