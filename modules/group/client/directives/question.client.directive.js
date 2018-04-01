(function () {
  'use strict';

  angular
    .module('group')
    .directive('question', function () {
        return {
            transclude: true,
            scope: {
                value: '=',
            },
            templateUrl: 'modules/group/client/views/question-directive.client.view.html',
            restrict: 'E',
            controller: 'QuestionController',
            controllerAs: 'vm'
        };
    })
    .controller('QuestionController', QuestionController);

  // question.$inject = [];
  QuestionController.$inject = ['$scope', '$stateParams', 'Authentication', '$state'];

  function QuestionController($scope, $stateParams, Authentication, $state) {
      var vm = this;
      vm.auth = Authentication;

      vm.question = $scope.value;
      console.log(vm.question);
  }
})();
