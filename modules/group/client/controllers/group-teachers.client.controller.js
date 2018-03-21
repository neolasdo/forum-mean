(function() {
    'use strict';

    angular
        .module('group')
        .controller('GroupTeachersController', GroupTeachersController)
        .controller('AddTeachersController', AddTeachersController);

    GroupTeachersController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];
    AddTeachersController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', '$modalInstance', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

    function GroupTeachersController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;

        vm.groupId = $stateParams.id;
        vm.teachers = [];

        groupService.get({id: vm.groupId}, function (res) {
            if (res.status == 'success') {
                vm.groupInfo = res.data;
            }
        });

        vm.getTeachers = function () {
            groupService.getTeachers({id: vm.groupId}, function (res) {
                if (res.status == 'success') {
                    vm.teachers = res.data;
                }
            }, function (err) {
                console.log(err);
            })
        }
        vm.getTeachers();
        vm.removeTeacher = function(id) {
            if(confirm('Bạn có chắc muốn xóa giáo viên này?'))
            {
                groupService.removeTeacher({id: vm.groupId, uid: id}, function(res) {
                    if(res.status == 'success') {
                        toastr.success('Đã xóa thành công');
                        $state.reload();                    }
                }, function (err) {
                    console.log(err)
                })
            }
        }
        vm.addTeachers = function () {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'add-teachers-modal.html',
                controller: 'AddTeachersController',
                controllerAs: 'vm',
                size: 'md',
                windowClass: 'AddTeachersController'
            });
            modalInstance.result.then(function () {
                vm.getTeachers()
            })
        }
    }

    function AddTeachersController($rootScope, $scope, $http, $stateParams, $modalInstance, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;
        vm.add = [];
        vm.teacherJoined = [];
        vm.groupId = $stateParams.id;
        console.log(vm.groupId)
        vm.close = function () {
            $modalInstance.close();
        };
        vm.getTeachers = function () {
            groupService.getTeachers({id: vm.groupId}, function (res) {
                if (res.status == 'success') {
                    vm.teacherJoined = res.data;
                }
            }, function (err) {
                console.log(err);
            })
        }
        vm.getTeachers();
        vm.teachers = [];
        vm.imageURL = '';
        vm.getListTeacher = function () {
            $http.get('/api/users/getAllTeacher').then(function(res) {
                vm.teachers = res.data;
                var index = vm.teachers.findIndex(function(teacher) {
                    return teacher._id === Authentication.user._id;
                });
                vm.teachers.splice(index, 1);
                if (vm.teacherJoined.length > 0){
                    vm.teacherJoined.forEach(function(item){
                        var index = vm.teachers.findIndex(function(teacher) {
                            return teacher._id === item._id;
                        });
                        vm.teachers.splice(index, 1);
                    })
                }
            })
        };
        vm.getListTeacher();

        vm.save = function() {
            if (vm.add.length){
                groupService.addTeachers({id: vm.groupId},{teachers : vm.add}, function (res) {
                    if(res.status == 'success'){

                        toastr.success('Thêm thành công');
                        vm.close();
                    }
                }, function (err) {
                    console.log(err);
                })
            }
        }
    }
})();
