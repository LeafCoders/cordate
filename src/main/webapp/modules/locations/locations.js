'use strict';

(function () {

    var thisModule = angular.module('locations', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var locationsController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var locationController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var locationEditorController = ['$injector', '$scope', 'locationResource', 'item', function($injector, $scope, locationResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, locationResource, item);
    }];


    /* Configuration */
    var locationsConfig = ['$routeProvider', function($routeProvider) {
        var locationsPath = 'locations';

        var getAllLocations = ['locationResource', function(locationResource) {
            return locationResource.getAll();
        }];
        var getOneLocation = ['locationResource', function(locationResource) {
            return locationResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, locationsPath, { items: getAllLocations });
        utils.createBasicOneRoute($routeProvider, locationsPath, { item: getOneLocation });
    }];


    /* Module setup */

    thisModule.config(locationsConfig);
    thisModule.controller('locationsController', locationsController);
    thisModule.controller('locationController', locationController);
    thisModule.controller('locationEditorController', locationEditorController);

}());
