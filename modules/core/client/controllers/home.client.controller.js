'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication','$state', 'toastr', '$modal',
  function ($scope, $http, Authentication, $state, toastr, $modal) {
    var vm =this;
    // This provides Authentication context.
    vm.auth = Authentication;
    vm.showAll = false;
    vm.showAllGroup = function () {
        vm.showAll = ! vm.showAll;
    };
    vm.getJoinedGroup = function () {
        $http.get('/api/'+ vm.auth.user.roles + '/' + vm.auth.user._id + '/groups/getAllJoined').success(function(res) {

        }).error(function (err) {

        })
    };
    vm.getJoinedGroup();
    vm.getMyGroup = function () {
        if (vm.auth.user.roles == 'teacher'){
            $http.get('/api/teacher/' + vm.auth.user._id + '/groups/getAllByUser').success(function(res) {

            }).error(function (err) {

            })
        }
    };
    vm.getMyGroup();
    vm.addGroup = function() {
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'modules/core/client/views/addGroupModal.html',
            controller: 'AddGroupController',
            controllerAs: 'vm',
            size: 'lg',
            windowClass: 'AddGroupController',
        });
    }
    if(vm.auth.user == ''){
        $state.go('authentication.signin');
    };
  }
]).controller('AddGroupController', ['$scope', '$http', 'Authentication','$state', 'toastr', '$modal', '$modalInstance', '$timeout', '$window', 'FileUploader',
    function($scope, $http, Authentication, $state, toastr, $modal, $modalInstance, $timeout, $window, FileUploader){
        var vm = this;
        vm.teachers = [];
        vm.imageURL = '';
        vm.getListTeacher = function () {
            $http.get('/api/users/getAllTeacher').then(function(res) {
                vm.teachers = res.data;
                var index = vm.teachers.findIndex(teacher => teacher._id === Authentication.user._id);
                vm.teachers.splice(index, 1);
            })
        };
        vm.getListStudent = function () {
            $http.get('/api/users/getAllStudent').then(function(res) {
                vm.students = res.data;
            })
        }
        vm.getListTeacher();
        vm.getListStudent();
        vm.group = {};
        vm.user = Authentication.user;

        vm.close = function () {
            $modalInstance.close();
        };

        vm.uploader = new FileUploader({
            url: '/api/groups/picture',
            alias: 'newGroupPicture'
        });

        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        vm.uploader.onAfterAddingFile = function (fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        vm.error = null;
                        vm.imageURL = fileReaderEvent.target.result;
                        vm.uploader.uploadAll();
                    }, 0);
                };
            }
        };
        vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            vm.imageURL = response;
            vm.uploader.clearQueue();
        };

        vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
            vm.uploader.clearQueue();
            vm.error = response.message;
            vm.imageURL = '';
        };

        vm.save = function () {
            if (vm.imageURL){
                vm.group.image = vm.imageURL;
            }
            if (vm.user) {
                vm.group.createdBy = vm.user._id;
            }
            if (vm.group) {
                $http.post('/api/addGroup', vm.group).success(function (res) {
                    if (res.status == 'success') {
                        vm.hasError = false;
                        toastr.success('Lớp học đã được tạo thành công');
                        vm.close();
                        $state.reload();
                    }
                }).error(function (err) {
                    vm.hasError = true;
                    vm.errorMessages = err;
                })
            }
        };
    }
]);
