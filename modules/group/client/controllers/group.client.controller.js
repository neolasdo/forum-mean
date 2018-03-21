'use strict';

angular.module('group').controller('GroupController', ['$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService',
    function GroupController($scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;
        vm.groupId = $stateParams.id;
        groupService.get({id: vm.groupId}, function (res){
          if (res.status == 'success') {
              vm.groupInfo = res.data;
          }
        })
        vm.count = function() {
            groupService.count({id: vm.groupId}, function (res){
                if (res.status == 'success') {
                    vm.count = res.data;
                }
            })
        }
        vm.count();
        vm.resetCode = function () {
            if(confirm('Thay đổi mã bảo mật?')){
                groupService.resetCode({groupId : vm.groupId}, function (res){
                    if (res.status == 'success'){
                        vm.groupInfo = res.data;
                    }
                },function(err){
                    console.log(err);
                })
            }
        }
    }
]);
