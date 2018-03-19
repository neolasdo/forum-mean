(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupHomeController', GroupHomeController);

  GroupHomeController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

  function GroupHomeController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      vm.auth = Authentication;
      vm.newTopic = {};
      vm.topics = {};
      vm.groupInfo;
      vm.groupId = $stateParams.id;

      groupService.get({id: vm.groupId}, function (res){
          if (res.status == 'success') {
              vm.groupInfo = res.data;
          }
      })


      vm.groupId = $stateParams.id;
      vm.getTopics = function () {
          groupService.getTopics({id : vm.groupId}, function (res){
              if (res.status == 'success' && res.data){
                  vm.topics = res.data;
              }
          },function(err){
              console.log(err);
          })
      };
      vm.getTopics();
      vm.createTopic = function() {
          groupService.createTopic({groupId : vm.groupId, topic : vm.newTopic, user: vm.auth.user._id}, function (res){
              if (res.status == 'success'){
                  vm.newTopic = {};
                  toastr.success('Bài viết đã được tạo thành công');
                  vm.getTopics();
              }
          },function(err){
              console.log(err);
          })
      }
      vm.hideTopic = function(id) {
          if(confirm('Bạn có chắc muốn ẩn bài viết?')){
              groupService.hideTopic({id: id}, function (res) {
                  if (res.status == 'success'){
                      toastr.success('Cập nhật bài viết thành công');
                      vm.getTopics();
                  }
              }, function (er) {
                  console.log(er);
              })
          }
      }
      vm.createComment = function (id, content) {
          if (content.length > 1 ){
              groupService.createComment({topicId: id, userId: vm.auth.user._id, content: content}, function (res) {
                  if (res.status == 'success') {
                      toastr.success('Đã đăng bình luận của bạn');
                      vm.getTopics();
                  }
              }, function (err) {
                  console.log(err);
              })
          }else{
              toastr.warning('Nội dung bình luận không được trống');
          }
      }
  }
})();
