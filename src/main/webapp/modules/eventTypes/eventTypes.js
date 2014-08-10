'use strict';

(function () {

    var thisModule = angular.module('eventTypes', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var eventTypesController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var eventTypeController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var eventTypeEditorController = ['$injector', '$scope', 'eventTypeResource', 'item', function($injector, $scope, eventTypeResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, eventTypeResource, item);
    }];


    /* Configuration */
    var eventTypesConfig = ['$routeProvider', function($routeProvider) {
        var eventTypesPath = 'eventTypes';

        var getAllEventTypes = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getAll();
        }];
        var getOneEventType = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, eventTypesPath, { items: getAllEventTypes });
        utils.createBasicOneRoute($routeProvider, eventTypesPath, { item: getOneEventType });
    }];


    /* Module setup */

    thisModule.config(eventTypesConfig);
    thisModule.controller('eventTypesController', eventTypesController);
    thisModule.controller('eventTypeController', eventTypeController);
    thisModule.controller('eventTypeEditorController', eventTypeEditorController);

}());
