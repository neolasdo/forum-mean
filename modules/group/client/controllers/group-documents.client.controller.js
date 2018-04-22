(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupDocumentsController', GroupDocumentsController);

  GroupDocumentsController.$inject = ['$rootScope','$scope', '$window' , '$timeout','$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService', 'FileUploader'];

  function GroupDocumentsController($rootScope, $scope, $window, $timeout, $http, $stateParams, Authentication, $state, $modal, toastr, groupService, FileUploader) {
      var vm = this;
      vm.auth = Authentication;
      vm.fileInfo = {};
      vm.documents = [];
      vm.groupInfo = [];
      vm.groupId = $stateParams.id;
      groupService.get({id: vm.groupId}, function (res){
          if (res.status == 'success') {
              vm.groupInfo = res.data;
          }
      })
      vm.getDocuments = function() {
          groupService.getDocuments({id: vm.groupId}, function(res) {
              if (res.status == 'success') {
                  vm.documents = res.data;
              }
          }, function (fail) {
              console.log(fail);
          })
      }
      vm.getDocuments();
      vm.removeDocument = function (id) {
          if($window.confirm('Bạn có chắc chắn muốn xóa tài liệu?')) {
              groupService.removeDocument({id: id}, function (res) {
                  if (res.status == 'success') {
                      toastr.success('Đã xóa!');
                      vm.getDocuments();
                  }
              }, function (fail) {
                  toastr.warning('Không thể xóa tài liệu');
              })
          }
      }
      $scope.cancelUpload = function () {
          $scope.fileName = '';
          $scope.uploader.clearQueue();
      };
      $scope.uploader = new FileUploader({
          url: '/api/saveDocument',
          alias: 'newGroupDocument'
      });
      $scope.uploader.filters.push({
          name: 'documentFilter',
          fn: function (item, options) {
              $scope.fileName = item.name;
              var allowedExtensions = ['doc','docx', 'txt', 'css', 'csv', 'eot', 'htm', 'html', 'jar', 'js','json', 'pdf', 'ppt', 'pptx', 'rar', 'xls', 'xlsx', 'xml', 'zip'];
              var ext  = item.name.split('.').pop(); //get the file extension
              return allowedExtensions.indexOf(ext) !== -1;;
              // var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
              // return '|doc|docx|pdf|ppt|pptx|xls|csv|js|xlsx|'.indexOf(type) !== -1;
          }
      });
      $scope.uploader.onAfterAddingFile = function (fileItem) {
          if ($window.FileReader) {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(fileItem._file);

              fileReader.onload = function (fileReaderEvent) {
                  $timeout(function () {
                      $scope.fileUrl = fileReaderEvent.target.result;
                  }, 0);
              };
          }
      };

      vm.uploadFile = function() {
          $scope.success = $scope.error = null;
          $scope.uploader.uploadAll();
          $scope.fileName = '';

          $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
              groupService.uploadFile({uid: vm.auth.user._id, gid: vm.groupId, file: response, info: vm.fileInfo}, function (res) {
                  if (res.status == 'success') {
                      toastr.success('Tài liệu đã được tải lên');
                      $state.reload();
                  }
              }, function (err) {
                  console.log(err);
                  toastr.warning('Có lỗi')
              })
              $scope.cancelUpload();
          };
          $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
              $scope.cancelUpload();
              $scope.error = response.message;
          };

      }
  }
})();
