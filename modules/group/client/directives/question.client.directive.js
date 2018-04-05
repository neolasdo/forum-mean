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

      vm.answer = '';
      vm.question = $scope.value;
      vm.addAnswer = function(answer) {
          if (answer != '') {
              vm.question.answers.push(answer);
              answer = '';
          }
      }
      vm.removeAnswer = function (index, answer) {
          vm.question.answers.splice(index, 1);
      }
  }
})();
