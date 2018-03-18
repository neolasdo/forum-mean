(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupDocumentsController', GroupDocumentsController);

  GroupDocumentsController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupDocumentsController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;

      vm.groupId = $stateParams.id;
  }
})();
