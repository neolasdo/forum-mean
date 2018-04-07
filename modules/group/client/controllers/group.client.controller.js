'use strict';

angular.module('group').controller('GroupController', ['$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService',
    function GroupController($scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;
        vm.groupId = $stateParams.id;
        vm.assignments = [];
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
        groupService.getActiveAssignment({id: vm.groupId}, function(res) {
            if(res.status == 'success') {
                vm.assignments = res.data;
            }
        }, function (fail) {
            toastr.warning('Lỗi khi lấy bài kiểm tra');
            console.log(fail);
        });
        vm.openStream = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'stream-modal.html',
                controller: 'StreamController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                windowClass: 'StreamController'
            });
        };
        vm.finishAssignment = function (assignment) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'finish-assignment.html',
                controller: 'FinishAssignmentController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                windowClass: 'FinishAssignmentController',
                resolve: {
                    data: assignment
                }
            });
        }
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
]).controller('StreamController',  ['$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService', '$modalInstance',
    function StreamController($scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService, $modalInstance) {
    var vm = this;
    vm.close = function () {
        $modalInstance.close();
    };
}]).controller('FinishAssignmentController',  ['$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService', '$modalInstance', 'data',
    function FinishAssignmentController($scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService, $modalInstance, data) {
    var vm = this;
    vm.assignment = data;
    vm.auth = Authentication;
    vm.studentAnswer = {};
    vm.studentAnswer.student = vm.auth.user._id;
    vm.studentAnswer.assignment = vm.assignment._id;

    vm.close = function () {
        $modalInstance.close();
    };
    vm.save = function () {
        console.log(vm.studentAnswer)
    }
}]);
