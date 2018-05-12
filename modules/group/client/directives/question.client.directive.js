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
      vm.addAnswer = function() {
          if (vm.answer != '') {
              vm.question.answers.push(vm.answer);
          }
          vm.answer = '';
      }
      vm.removeAnswer = function (index, answer) {
          vm.question.answers.splice(index, 1);
      }
      vm.changeValue = function (index, answer) {
          if (answer) vm.question.answers[index] = answer;
      }
      vm.resetType = function () {
          if (vm.question.type == 'multi_choice') {
              vm.question.answers = [];
              vm.question.correctAnswer = [];
          }
          if (vm.question.type == 'text' || vm.question.type == 'true/false') {
              vm.question.answers = '';
              vm.question.correctAnswer = '';
          }
          if (vm.question.type == 'pick_one') {
              vm.question.answers = [];
              vm.question.correctAnswer = [];
          }
      }
  }
})();
