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


        vm.addAssignment = function () {
            var modalInstance = $modal.open({
                animation: true,
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

    function AddAssigmentsController($rootScope, $scope, $http, $stateParams, $modalInstance, Authentication, $state, $modal, toastr, groupService, question) {
        var vm = this;
        vm.auth = Authentication;
        vm.assigment = {};
        vm.assigment.questions = [];
        vm.addQuestion = function() {
            vm.assigment.questions.push({
                question: "",
                type: "",
                answers: [],
                correctAnswer: "",
                createdBy: vm.auth.user._id
            })
        }
        vm.groupId = $stateParams.id;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: false
        };
        $scope.today = moment();
        vm.close = function () {
            $modalInstance.close();
        };
        vm.openDatePicker1 = function() {
            vm.showCalendar1 = true
        }
        vm.openDatePicker2 = function() {
            vm.showCalendar2 = true
        }

        vm.isValidated = function() {
            return (vm.assigment.name && vm.assigment.startDate && vm.assigment.endDate && vm.assigment.questions.length);
        }
        vm.save = function() {

        }
    }
})();
