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
      vm.groupId = $stateParams.id;
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
      // vm.readFile = function(){
      //     if (this.files && this.files[0]) {
      //         var FR= new FileReader();
      //         FR.readAsDataURL( this.files[0] );
      //         vm.fileInfo.fileName = this.files[0].name;
      //         vm.fileInfo.extension = vm.getExtension(vm.fileInfo.fileName);
      //
      //         FR.addEventListener("load", function(e) {
      //             vm.fileInfo.file = e.target.result;
      //         });
      //     }
      // };
      // vm.getExtension = function(filename) {
      //     return typeof filename != "undefined" ? filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase() : false;
      // }
      // function dataURLtoFile(dataurl) {
      //     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      //         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      //     while(n--){
      //         u8arr[n] = bstr.charCodeAt(n);
      //     }
      //     var blob = new Blob([u8arr], {type:mime});
      //     return blob;
      // }
      // vm.chooseFile = function () {
      //     var input = document.querySelector('input[type=file]');
      //     input.click();
      //     input.addEventListener("change", vm.readFile);
      // }
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
              var allowedExtensions = ['doc','docx','pdf','ppt','pptx','xls','csv','xlsx'];
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
