(function() {
    'use strict';

    angular
        .module('group')
        .controller('GroupAssigmentsController', GroupAssigmentsController)
        .controller('AddAssigmentsController', AddAssigmentsController);

    GroupAssigmentsController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];
    AddAssigmentsController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', '$modalInstance', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

    function GroupAssigmentsController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;

        vm.groupId = $stateParams.id;
        vm.teachers = [];

        groupService.get({id: vm.groupId}, function (res) {
            if (res.status == 'success') {
                vm.groupInfo = res.data;
            }
        });


        vm.addTeachers = function () {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'add-assigments-modal.html',
                controller: 'AddAssigmentsController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'AddAssigmentsController'
            });
            modalInstance.result.then(function () {

            })
        }
    }

    function AddAssigmentsController($rootScope, $scope, $http, $stateParams, $modalInstance, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;
        vm.add = [];
        vm.groupId = $stateParams.id;
        console.log(vm.groupId)
        vm.close = function () {
            $modalInstance.close();
        };

        vm.save = function() {
            if (vm.add.length){

            }
        }
    }
})();
