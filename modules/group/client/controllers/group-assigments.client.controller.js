(function() {
    'use strict';

    angular
        .module('group')
        .controller('GroupAssigmentsController', GroupAssigmentsController)
        .controller('AddAssigmentsController', AddAssigmentsController);

    GroupAssigmentsController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];
    AddAssigmentsController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', '$modalInstance', 'Authentication', '$state', '$modal', 'toastr', 'groupService', 'data'];

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

        groupService.getAssignments({id: vm.groupId}, function(res){
            if (res.status == 'success') {
                vm.assignments = res.data;
            }
        });

        vm.removeAssignment = function (id) {
            if (confirm('Bạn có chắc chắn muốn xóa?')) {
                groupService.deleteAssignment({id: id},{}, function(res){
                    if (res.status == 'success') {
                        toastr.success('Xóa thành công!');
                        $state.reload();
                    }
                }, function (fail){
                    toastr.warning('Có lỗi!')
                })
            }
        };
        vm.editAssignment = function (data) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'add-assigments-modal.html',
                controller: 'AddAssigmentsController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'AddAssigmentsController',
                resolve: {
                    data: data
                }
            });
        }
        vm.addAssignment = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'add-assigments-modal.html',
                controller: 'AddAssigmentsController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'AddAssigmentsController',
                resolve: {
                    data: {}
                }
            });
        }
    }

    function AddAssigmentsController($rootScope, $scope, $http, $stateParams, $modalInstance, Authentication, $state, $modal, toastr, groupService, data) {
        var vm = this;

        vm.auth = Authentication;
        vm.assigment = data;
        vm.assigment.questions = data.questions?data.questions:[];
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
            vm.assigment.groupId = vm.groupId;
            if (!data || (data && !data._id)){
                groupService.createAssignment({'assignment': vm.assigment}, function (res) {
                    if (res.status == 'success') {
                        toastr.success('Tạo thành công');
                        $state.reload();
                        vm.close();
                    }
                }, function (fail) {
                    console.log(fail);
                    toastr.warning('Có lỗi!')
                })
            }
            else{
                groupService.updateAssignment({id: data._id},{'assignment': vm.assigment}, function (res) {
                    if (res.status == 'success') {
                        toastr.success('Cập nhật thành công!');
                        $state.reload();
                        vm.close();
                    }
                }, function (fail) {
                    console.log(fail);
                    toastr.warning('Có lỗi!')
                })
            }
        }
    }
})();
