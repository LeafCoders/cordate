'use strict';

(function () {

    var thisModule = angular.module('baseUI', ['rosetteResources']);

    /* Configuration */

    var baseUIConfig = ['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/eventWeeks/current' });
    }];


    /* Module setup */

    thisModule.config(baseUIConfig);

}());
