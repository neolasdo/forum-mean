(function() {
  'use strict';

  angular
    .module('core')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$scope', 'Authentication', '$state'];

  function SidebarController($scope, Authentication, $state) {
    var vm = this;
    vm.show = false;
    vm.auth = Authentication;
    if (vm.auth.user != ''){
      vm.show = true
    }
  }
})();
