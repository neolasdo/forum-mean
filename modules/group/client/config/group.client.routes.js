(function () {
  'use strict';

  //Setting up route
  angular
    .module('group')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
      $stateProvider
        .state('group', {
            url: '/group/:id',
            templateUrl: 'modules/group/client/views/group.client.view.html',
            data: {
              roles: ['teacher', 'student']
            }
        });
  }
})();
