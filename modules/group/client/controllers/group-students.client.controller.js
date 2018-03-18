(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupStudentsController', GroupStudentsController);

  GroupStudentsController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupStudentsController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;

      vm.groupId = $stateParams.id;
  }
})();
