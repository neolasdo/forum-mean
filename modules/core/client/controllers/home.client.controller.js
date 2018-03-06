'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$state',
  function ($scope, Authentication, $state) {
    var vm =this;
    // This provides Authentication context.
    vm.auth = Authentication;
    if(vm.auth.user == ''){
        $state.go('authentication.signin');
    };
  }
]);
