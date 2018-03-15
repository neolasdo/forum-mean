(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupSettingController', GroupSettingController);

  GroupSettingController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupSettingController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
    var vm = this;

  }
})();
