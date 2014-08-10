'use strict';

(function () {

    var thisModule = angular.module('groups', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var groupsController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var groupController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var groupEditorController = ['$injector', '$scope', 'groupResource', 'item', function($injector, $scope, groupResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, groupResource, item);
    }];


    /* Configuration */
    var groupsConfig = ['$routeProvider', function($routeProvider) {
        var groupsPath = 'groups';

        var getAllGroups = ['groupResource', function(groupResource) {
            return groupResource.getAll();
        }];
        var getOneGroup = ['groupResource', function(groupResource) {
            return groupResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, groupsPath, { items: getAllGroups });
        utils.createBasicOneRoute($routeProvider, groupsPath, { item: getOneGroup });
    }];


    /* Module setup */

    thisModule.config(groupsConfig);
    thisModule.controller('groupsController', groupsController);
    thisModule.controller('groupController', groupController);
    thisModule.controller('groupEditorController', groupEditorController);

}());
