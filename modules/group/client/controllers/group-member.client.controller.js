(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupMemberController', GroupMemberController)
    GroupMemberController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupMemberController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;

      vm.groupId = $stateParams.id;
      vm.memberId = $stateParams.uid;

      groupService.get({id: vm.groupId}, function (res){
          if (res.status == 'success') {
              vm.groupInfo = res.data;
          }
      })
      groupService.getMemberInfo({id: vm.groupId, uid: vm.memberId}, function (res) {
          if (res.status == 'success') {
              vm.memberInfo = res.data
          }
      }, function (fail) {
          console.log(fail);
      })


  }
})();
