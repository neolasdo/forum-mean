(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupInfoController', GroupInfoController);

  GroupInfoController.$inject = ['$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupInfoController($scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;
      vm.groupId = $stateParams.id;
      groupService.get({id: vm.groupId}, function (res){
          if (res.status == 'success') {
              vm.groupInfo = res.data;
          }
      });

      vm.count = function() {
          groupService.count({id: vm.groupId}, function (res){
              if (res.status == 'success') {
                  vm.count = res.data;
              }
          })
      }
      groupService.checkJoined({id: vm.groupId, uid: vm.auth.user._id}, function (res) {
          if(res.status == 'success') {

          }
      }, function (err) {
          console.log(err);
      })
      vm.count();
      vm.join = function () {
          groupService.join({id: vm.groupId, code: vm.code, userId: vm.auth.user._id}, function (res){
              if (res.status == 'success') {
                  vm.groupInfo = res.data;
                  toastr.success("Tham gia thành công");
                  $state.go('group.home', {id: vm.groupId});
              }
              if (res.status == 'wrong') {
                toastr.warning('Mã bảo mật sai')
              }
          });
      }
  }
})();
