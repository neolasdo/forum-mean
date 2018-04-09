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
            if(vm.answer.length) {
                $scope.quizModel  = vm.answer.filter(function() { return true; });
            }
            else {
                $scope.quizModel = vm.quizModel;
            }
        }
    }

})();
