(function () {
  'use strict';

  //Setting up route
  angular
    .module('group')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
      $stateProvider
        .state('group-info', {
            url: '/group-info/:id',
            templateUrl: 'modules/group/client/views/group-info.client.view.html'
        })
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
        .state('group.students', {
            url: '/students',
            templateUrl: 'modules/group/client/views/group-students.client.view.html',
        })
        .state('group.assigments', {
            url: '/assigments',
            templateUrl: 'modules/group/client/views/group-assigments.client.view.html',
        })
        .state('group.videos', {
            url: '/videos',
            templateUrl: 'modules/group/client/views/group-videos.client.view.html',
        })
        .state('group.documents', {
            url: '/documents',
            templateUrl: 'modules/group/client/views/group-documents.client.view.html',
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
