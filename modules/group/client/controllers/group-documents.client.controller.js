(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupDocumentsController', GroupDocumentsController);

  GroupDocumentsController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService', 'FileUploader'];

  function GroupDocumentsController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService, FileUploader) {
      var vm = this;
      vm.auth = Authentication;
      vm.fileInfo = {};
      vm.groupId = $stateParams.id;
      vm.readFile = function(){
          if (this.files && this.files[0]) {
              var FR= new FileReader();
              FR.readAsDataURL( this.files[0] );
              vm.fileInfo.fileName = this.files[0].name;
              vm.fileInfo.extension = vm.getExtension(vm.fileInfo.fileName);

              FR.addEventListener("load", function(e) {
                  vm.fileInfo.file = e.target.result;
              });
          }
      };
      vm.getExtension = function(filename) {
          return typeof filename != "undefined" ? filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase() : false;
      }
      function dataURLtoFile(dataurl) {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          var blob = new Blob([u8arr], {type:mime});
          return blob;
      }
      vm.chooseFile = function () {
          var input = document.querySelector('input[type=file]');
          input.click();
          input.addEventListener("change", vm.readFile);
      }
      vm.uploadFile = function() {
          var file = vm.fileInfo;
          if (file.name && file.file) {
              file.file = dataURLtoFile(file.file);
              console.log(file);
              groupService.uploadFile({uid: vm.auth.user._id, gid: vm.groupId, file: file}, function (res) {

              }, function (err) {
                  console.log(err);
              })

          }else {
              toastr.warning('Bạn phải chọn và nhập tên file');
          }

      }
  }
})();
