(function () {
  'use strict';

  angular
    .module('group')
    .factory('groupService', groupService);

  groupService.$inject = ['$resource'];

  function groupService($resource) {
    return $resource( '/api/group/:id', {id: '@id'}, {

    });
  }
})();
