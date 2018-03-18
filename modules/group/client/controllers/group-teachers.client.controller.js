(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupTeachersController', GroupTeachersController);

  GroupTeachersController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupTeachersController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;

      vm.groupId = $stateParams.id;
  }
})();
