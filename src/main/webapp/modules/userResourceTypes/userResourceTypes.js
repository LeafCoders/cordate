'use strict';

(function () {

    var thisModule = angular.module('userResourceTypes', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var userResourceTypesController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var userResourceTypeController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var userResourceTypeEditorController = ['$injector', '$scope', 'userResourceTypeResource', 'item', 'groups',
                                            function($injector, $scope, userResourceTypeResource, item, groups) {
        utils.extendItemEditorController(this, $injector, $scope, userResourceTypeResource, item);
        $scope.formHelper = {
            groups: groups
        };
    }];


    /* Configuration */
    var userResourceTypesConfig = ['$routeProvider', function($routeProvider) {
        var userResourceTypesPath = 'userResourceTypes';

        var getAllUserResourceTypes = ['userResourceTypeResource', function(userResourceTypeResource) {
            return userResourceTypeResource.getAll();
        }];
        var getOneUserResourceType = ['userResourceTypeResource', function(userResourceTypeResource) {
            return userResourceTypeResource.getOne();
        }];
        var getAllGroups = ['groupResource', function(groupResource) {
            return groupResource.getAll();
        }];

        utils.createBasicAllRoute($routeProvider, userResourceTypesPath, { items: getAllUserResourceTypes });
        utils.createBasicOneRoute($routeProvider, userResourceTypesPath,
                { item: getOneUserResourceType },
                { item: getOneUserResourceType, groups: getAllGroups });
    }];


    /* Module setup */

    thisModule.config(userResourceTypesConfig);
    thisModule.controller('userResourceTypesController', userResourceTypesController);
    thisModule.controller('userResourceTypeController', userResourceTypeController);
    thisModule.controller('userResourceTypeEditorController', userResourceTypeEditorController);

}());
