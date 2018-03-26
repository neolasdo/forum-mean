(function () {
  'use strict';

  angular
    .module('group')
    .directive('question', question);

  question.$inject = [/*Example: '$state', '$window' */];

  function question(/*Example: $state, $window */) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // Question directive logic
        // ...

        element.text('this is the question directive');
      }
    };
  }
})();
