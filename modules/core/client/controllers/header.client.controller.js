'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$modal', '$state', 'Authentication', 'Menus', 'groupService', 'toastr',
  function ($scope, $modal, $state, Authentication, Menus, groupService, toastr) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    $scope.searchClass = function(key) {
      groupService.search({key:key}, function(res) {
          if (res.status == 'success'){
              var group = res.data;
              if (group.length > 0) {
                  var modalInstance = $modal.open({
                      animation: false,
                      templateUrl: 'search-result-modal.html',
                      controller: 'SearchResultController',
                      controllerAs: 'vm',
                      size: 'md',
                      windowClass: 'SearchResultController',
                      resolve: {
                          data: res
                      }
                  });
              }
              else toastr.warning('Không tìm thấy lớp học nào');
          }
      },function (err) {
          console.log(err);
      })
    }
  }
]).controller('SearchResultController', ['$scope', '$modal', '$state', 'Authentication', 'Menus', 'groupService', '$modalInstance', 'toastr', 'data',
    function ($scope, $modal, $state, Authentication, Menus, groupService, $modalInstance, toastr, data) {
        var vm = this;
        vm.groups = data.data;
        vm.close = function () {
            $modalInstance.close();
        };
}]);
