(function () {
  'use strict';

  angular
    .module('group')
    .directive('quiz', function () {
        return {
            transclude: true,
            scope: {
                value: '=',
                quizModel: '='
            },
            templateUrl: 'modules/group/client/views/quiz-directive.client.view.html',
            restrict: 'E',
            controller: 'QuizController',
            controllerAs: 'vm'
        };
    }).controller('QuizController', QuizController);

    // question.$inject = [];
    QuizController.$inject = ['$scope', '$stateParams', 'Authentication', '$state'];

    function QuizController($scope, $stateParams, Authentication, $state) {
        var vm = this;
        vm.auth = Authentication;
        vm.answer = [];
        vm.quizModel = '';
        vm.question = $scope.value;
        vm.onChange = function () {
            $scope.quizModel = vm.answer.length?vm.answer:vm.quizModel;
        }
    }

})();
