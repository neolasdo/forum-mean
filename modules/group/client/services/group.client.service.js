(function () {
  'use strict';

  angular
    .module('group')
    .factory('groupService', groupService);

  groupService.$inject = ['$resource'];

  function groupService($resource) {
    return $resource( '/api/group/:id', {}, {
        resetCode: {
            method: 'PUT',
            url: '/api/group/resetCode'
        },
        search : {
            method: 'GET',
            url: '/api/group/find/:key'
        },
        checkJoined : {
            method: 'GET',
            url: '/api/group/:id/user/:uid'
        },
        join : {
            method: 'POST',
            url: '/api/joinGroup'
        },
        removeStudent : {
            method: 'POST',
            url: '/api/removeStudent'
        },
        count : {
            method: 'GET',
            url: '/api/group/:id/count'
        },
        getStudents : {
            method: 'GET',
            url: '/api/group/:id/students'
        },
        addStudents : {
            method: 'POST',
            url: '/api/group/:id/addStudents'
        },
        createTopic: {
            method: 'POST',
            url: 'api/group/createTopic'
        },
        getTopics: {
            method: 'GET',
            url: 'api/group/:id/topics'
        },
        hideTopic: {
            method: 'PUT',
            url: '/api/topic/hide'
        },
        createComment: {
            method: 'POST',
            url: '/api/createComment'
        },
        uploadFile: {
            method: 'POST',
            url: '/api/uploadDocument'
        },
        getTopic: {
            method: 'GET',
            url: '/api/topics/:topicId'
        },
        createAssignment: {
            method: 'POST',
            url: '/api/assignment/create'
        },
        getAssignments: {
            method: 'GET',
            url: '/api/group/:id/assignments'
        },
        deleteAssignment: {
            method: 'POST',
            url: '/api/assignment/:id/destroy'
        },
        updateAssignment: {
            method: 'PUT',
            url: '/api/assignment/:id/update'
        },
        getActiveAssignment: {
            method: 'GET',
            url: '/api/group/:id/activeAssignments'
        }
    });
  }
})();
