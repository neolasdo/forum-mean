(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupStudentsController', GroupStudentsController)
    .controller('AddStudentsController', AddStudentsController);

  GroupStudentsController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];
  AddStudentsController.$inject = ['$rootScope','$scope', '$http', '$stateParams', '$modalInstance', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupStudentsController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;

      vm.groupId = $stateParams.id;
      vm.students = [];
      groupService.get({id: vm.groupId}, function (res){
          if (res.status == 'success') {
              vm.groupInfo = res.data;
          }
      })

      vm.getStudents = function(){
          groupService.getStudents({id: vm.groupId}, function (res) {
              if(res.status == 'success') {
                  vm.students = res.data;
              }
          }, function (err){
              console.log(err);
          })
      }
      vm.getStudents();
      vm.addStudents = function() {
          var modalInstance = $modal.open({
              animation: false,
              templateUrl: 'add-students-modal.html',
              controller: 'AddStudentsController',
              controllerAs: 'vm',
              size: 'md',
              windowClass: 'AddStudentsController'
          });
          modalInstance.result.then(function() {
              vm.getStudents();
          });
      }
  }
  function AddStudentsController($rootScope, $scope, $http, $stateParams, $modalInstance, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;
      vm.add = [];
      vm.studentJoined = [];
      vm.groupId = $stateParams.id;
      vm.close = function () {
          $modalInstance.close();
      };
      vm.getStudents = function(){
          groupService.getStudents({id: vm.groupId}, function (res) {
              if(res.status == 'success') {
                  vm.studentJoined = res.data;
              }
          }, function (err){
              console.log(err);
          })
      }
      vm.getStudents();
      vm.getListStudent = function () {
          $http.get('/api/users/getAllStudent').then(function(res) {
              vm.students = res.data;
              if (vm.studentJoined.length) {
                  vm.studentJoined.forEach(function(item){
                      var index = vm.students.findIndex(function(student) {
                          return student._id === item._id;
                      });
                      vm.students.splice(index, 1);
                  })
              }
          })
      }
      vm.getListStudent();
      vm.save = function() {
          if (vm.add.length){
              groupService.addStudents({id: vm.groupId}, {students : vm.add}, function (res) {
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
