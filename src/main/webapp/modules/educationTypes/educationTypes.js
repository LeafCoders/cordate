'use strict';

(function () {

    var thisModule = angular.module('educationTypes', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var educationTypesController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var educationTypeController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var educationTypeEditorController = ['$injector', '$scope', 'educationTypeResource', 'item',
                                     function($injector, $scope, educationTypeResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, educationTypeResource, item);
    }];
    
    /* Configuration */
    var educationTypesConfig = ['$routeProvider', function($routeProvider) {
        var educationTypesPath = 'educationTypes';

        var getAllEducationTypes = ['educationTypeResource', function(educationTypeResource) {
            return educationTypeResource.getAll();
        }];
        var getOneEducationType = ['educationTypeResource', function(educationTypeResource) {
            return educationTypeResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, educationTypesPath, { items: getAllEducationTypes });
        utils.createBasicOneRoute($routeProvider, educationTypesPath, {
            item: getOneEducationType
        });
    }];


    /* Module setup */

    thisModule.config(educationTypesConfig);
    thisModule.controller('educationTypesController', educationTypesController);
    thisModule.controller('educationTypeController', educationTypeController);
    thisModule.controller('educationTypeEditorController', educationTypeEditorController);

}());
