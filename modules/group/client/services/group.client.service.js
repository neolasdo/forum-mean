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
        getTopic: {
            method: 'GET',
            url: 'api/topics/:topicId'
        },
    });
  }
})();
