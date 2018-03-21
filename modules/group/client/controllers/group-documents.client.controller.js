(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupDocumentsController', GroupDocumentsController);

  GroupDocumentsController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService', 'FileUploader'];

  function GroupDocumentsController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService, FileUploader) {
      var vm = this;
      vm.auth = Authentication;

      vm.groupId = $stateParams.id;
      vm.readFile = function(){
          if (this.files && this.files[0]) {
              var FR= new FileReader();
              FR.readAsDataURL( this.files[0] );
              FR.addEventListener("load", function(e) {
                  vm.file = e.target.result;
                  vm.uploadFile();
              });
          }
      }
      vm.chooseFile = function () {

          var input = document.querySelector('input[type=file]');
          input.click();
          input.addEventListener("change", vm.readFile);
          console.log(input.val);
      }
      vm.uploadFile = function() {
          var file = vm.file;
          groupService.uploadFile({uid: vm.auth.user._id, gid: vm.groupId, file: file, desc: vm.desc, name: vm.name}, function (res) {

          }, function (err) {
              console.log(err);
          })
      }
  }
})();
