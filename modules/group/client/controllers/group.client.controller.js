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

        vm.resetCode = function () {

        }
        vm.createPost = function() {

        }
    }
]);
