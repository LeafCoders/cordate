'use strict';

(function () {

    var thisModule = angular.module('resourceTypes', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var resourceTypesController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);

        utils.extendCreateWithModal($injector, $scope, 'resourceType.modalTitle.create',
            [
                 { title: 'resourceType.type.user', url: '/' + $scope.types + '/new?type=user' },
                 { title: 'resourceType.type.upload', url: '/' + $scope.types + '/new?type=upload' },
            ]
        );
    }];

    var resourceTypeController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var resourceTypeEditorController = ['$injector', '$scope', 'resourceTypeResource', 'item', 'groups',
                                        function($injector, $scope, resourceTypeResource, item, groups) {
        utils.extendItemEditorController(this, $injector, $scope, resourceTypeResource, item);
        $scope.formHelper = {
            groups: groups
        };
    }];


    /* Configuration */
    var resourceTypesConfig = ['$routeProvider', function($routeProvider) {
        var resourceTypesPath = 'resourceTypes';

        var getAllUserResourceTypes = ['resourceTypeResource', function(resourceTypeResource) {
            return resourceTypeResource.getAll();
        }];
        var getOneUserResourceType = ['resourceTypeResource', function(resourceTypeResource) {
            return resourceTypeResource.getOne();
        }];
        var getAllGroups = ['groupResource', function(groupResource) {
            return groupResource.getAll();
        }];

        utils.createBasicAllRoute($routeProvider, resourceTypesPath, { items: getAllUserResourceTypes });
        utils.createBasicOneRoute($routeProvider, resourceTypesPath,
                { item: getOneUserResourceType },
                { item: getOneUserResourceType, groups: getAllGroups });
    }];


    /* Module setup */

    thisModule.config(resourceTypesConfig);
    thisModule.controller('resourceTypesController', resourceTypesController);
    thisModule.controller('resourceTypeController', resourceTypeController);
    thisModule.controller('resourceTypeEditorController', resourceTypeEditorController);

}());
