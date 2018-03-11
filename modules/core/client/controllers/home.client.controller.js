'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$state', 'toastr', '$modal',
  function ($scope, Authentication, $state, toastr, $modal) {
    var vm =this;
    // This provides Authentication context.
    vm.auth = Authentication;
    vm.showAll = false;
    vm.showAllGroup = function () {
        vm.showAll = ! vm.showAll;
    }
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
]).controller('AddGroupController', ['$scope', '$http', 'Authentication','$state', '$modal', '$modalInstance', '$timeout', '$window', 'FileUploader',
    function($scope, $http, Authentication, $state, $modal, $modalInstance, $timeout, $window, FileUploader){
        var vm = this;
        vm.teachers = [];
        vm.getListTeacher = function () {
            $http.get('/api/users/getAllTeacher').then(function(res) {
                vm.teachers = res.data;
                var index = vm.teachers.findIndex(teacher => teacher._id === Authentication.user._id);
                vm.teachers.splice(index, 1);
            })
        };
        vm.getListTeacher();
        vm.group = {};
        vm.user = Authentication.user;
        console.log(vm.user._id);
        vm.close = function () {
            $modalInstance.close();
        };
        vm.imageURL = '';
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
    }
]);
