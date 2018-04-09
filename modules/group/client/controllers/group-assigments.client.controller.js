(function() {
    'use strict';

    angular
        .module('group')
        .controller('GroupAssigmentsController', GroupAssigmentsController)
        .controller('AddAssigmentsController', AddAssigmentsController)
        .controller('ListAnswersController', ListAnswersController);

    GroupAssigmentsController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];
    AddAssigmentsController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', '$modalInstance', 'Authentication', '$state', '$modal', 'toastr', 'groupService', 'data'];
    ListAnswersController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', '$modalInstance', 'Authentication', '$state', '$modal', 'toastr', 'groupService', 'data'];

    function GroupAssigmentsController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;

        vm.groupId = $stateParams.id;
        vm.assignments = [];
        vm.teachers = [];

        groupService.get({id: vm.groupId}, function (res) {
            if (res.status == 'success') {
                vm.groupInfo = res.data;
            }
        });

        groupService.getAssignments({id: vm.groupId}, function(res){
            if (res.status == 'success') {
                vm.assignments = res.data;
                vm.getAnswers();
            }
        });

        vm.removeAssignment = function (id) {
            if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
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
        vm.getAnswers = function (id) {
            groupService.getAnswers(function (res) {
                if (res.status == 'success') {
                    vm.answers = res.data;
                    vm.answers.forEach(function (awn) {
                        vm.assignments.forEach(function (item) {
                            item.answers = [];
                            if (item._id === awn.assignment._id) {
                                item.answers.push(awn);
                            }
                        })
                    })
                }
            }, function (fail) {
                toastr.warning('Error')
            })
        }

        vm.listAnswer = function(list) {
            if(list && list.length > 0) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'list-answers-modal.html',
                    controller: 'ListAnswersController',
                    controllerAs: 'vm',
                    size: 'lg',
                    windowClass: 'ListAnswersController',
                    resolve: {
                        data:  function () {
                            return list
                        }
                    }
                });
            }
            else return;
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
        };
        vm.removeQuestion = function (index, question) {
            if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
                if (question._id) {
                    groupService.deleteQuestion({id: question._id}, {}, function (res) {
                        if (res.status == 'success') {
                            toastr.success('Xóa thành công!');
                            vm.assigment.questions.splice(index, 1);
                        }
                    }, function (fail) {
                        toastr.warning('Có lỗi!');
                    })
                }
                else {
                    vm.assigment.questions.splice(index, 1);
                }
            }
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

    function ListAnswersController($rootScope, $scope, $http, $stateParams, $modalInstance, Authentication, $state, $modal, toastr, groupService, data) {
        var vm = this;
        vm.data = data;
        vm.item = {};
        vm.close = function () {
            $modalInstance.close();
        };
        
        vm.showAnswer = function (item) {
            vm.item = item;
        }
        vm.back = function () {
            vm.item = {};
        }
    }
})();
