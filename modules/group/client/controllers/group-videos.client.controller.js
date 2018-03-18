(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupVideosController', GroupVideosController);

  GroupVideosController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupVideosController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;

      vm.groupId = $stateParams.id;
  }
})();
