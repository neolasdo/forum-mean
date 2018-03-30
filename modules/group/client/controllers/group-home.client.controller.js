(function() {
  'use strict';

  angular
    .module('group')
    .controller('GroupHomeController', GroupHomeController).controller('ViewTopicController', ViewTopicController);

  GroupHomeController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];
  ViewTopicController.$inject = ['$rootScope','$scope', '$http', '$stateParams', 'Authentication', '$state', '$modalInstance', 'toastr', 'groupService', 'data'];

  function GroupHomeController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
      var vm = this;
      moment.locale('vi');
      vm.getTimeAgo = function (time) {
          return moment(time).fromNow();
      };
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
      vm.likeTopic = function (id) {
          console.log(id)
      }
      vm.likeComment = function (id) {
          console.log(id)
      }
      vm.viewTopic = function (topic) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'view-topic.html',
              controller: 'ViewTopicController',
              controllerAs: 'vm',
              size: 'lg',
              windowClass: 'ViewTopicController',
              resolve: {
                  data: topic
              }
          });

          modalInstance.result.then(function () {
              vm.getTopics();
          })
      }
  }

  function ViewTopicController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modalInstance, toastr, groupService, data) {
      var vm = this;
      vm.auth = Authentication;
      moment.locale('vi');
      vm.getTimeAgo = function (time) {
          return moment(time).fromNow();
      };
      vm.topic = data;
      vm.newComment = null;
      vm.hideTopic = function(id) {
          if(confirm('Bạn có chắc muốn ẩn bài viết?')){
              groupService.hideTopic({id: id}, function (res) {
                  if (res.status == 'success'){
                      toastr.success('Ẩn bài viết thành công');
                      vm.close();
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
                      vm.getTopic();
                      vm.newComment = null;
                  }
              }, function (err) {
                  console.log(err);
              })
          }else{
              toastr.warning('Nội dung bình luận không được trống');
          }
      }
      vm.getTopic = function () {
          groupService.getTopic({topicId : vm.topic._id}, function (res){
              if (res.status == 'success' && res.data){
                  vm.topic = res.data;
              }
          },function(err){
              console.log(err);
          })
      };
      vm.close = function () {
          $modalInstance.close();
      };
  }
})();
