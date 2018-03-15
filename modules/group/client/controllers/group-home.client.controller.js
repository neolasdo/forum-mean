(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupHomeController', GroupHomeController);

  GroupHomeController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupHomeController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
    var vm = this;

  }
})();
