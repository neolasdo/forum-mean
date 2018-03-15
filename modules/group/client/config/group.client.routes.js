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
            abstract: true,
            templateUrl: 'modules/group/client/views/group.client.view.html',
            data: {
              roles: ['teacher', 'student']
            }
        })
        .state('group.home', {
            url: '/home',
            templateUrl: 'modules/group/client/views/group-home.client.view.html',
        })
        .state('group.setting', {
            url: '/setting',
            templateUrl: 'modules/group/client/views/group-setting.client.view.html',
            data: {
                roles: ['teacher']
            }
        })
      ;
  }
})();
