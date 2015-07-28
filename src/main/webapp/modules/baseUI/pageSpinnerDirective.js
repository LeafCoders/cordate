'use strict';

(function () {

    var thisModule = angular.module('baseUI');

    thisModule.directive("pageSpinner", ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        return {
            restrict: 'E',
            transclude: false,
            template: '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>',
            scope : {
                'foceShow' : '='
            },
            link : function(scope, elem, attrs) {
                var showTimer;

                scope.$watch('forceShow', function(newVal) {
                    newVal ? showSpinner(true) : hideSpinner(true);
                });

                function showSpinner(event, next, current) {
                    if (showTimer) return;
                    showTimer = $timeout(showElement.bind(this, true), 1000);
                }

                function hideSpinner(event, next, current) {
                    if (!scope.forceShow) {
                        if (showTimer) $timeout.cancel(showTimer);
                        showTimer = null;
                        showElement(false);
                    }
                }

                function showElement(show) {
                    show ? elem.addClass('show') : elem.removeClass('show');
                }

                $rootScope.$on('$routeChangeStart', showSpinner);
                $rootScope.$on('$routeChangeSuccess', hideSpinner);
                $rootScope.$on('$routeChangeError', hideSpinner);

                elem.addClass('page-spinner');
            }
        };
    }]);

}());
