'use strict';

(function () {

    var thisModule = angular.module('permissions', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var permissionsController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var permissionController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var permissionEditorController = ['$injector', '$scope', 'permissionResource', 'item', 'users', 'groups',
                                      function($injector, $scope, permissionResource, item, users, groups) {
        utils.extendItemEditorController(this, $injector, $scope, permissionResource, item);

        var permissionType = "everyone";
        var permissionId = null;
        if ($scope.item.groupId) {
            permissionType = "group";
            permissionId = $scope.item.groupId;
        } else if ($scope.item.userId) {
            permissionType = "user";
            permissionId = $scope.item.userId;
        }

        $scope.formHelper = {
            permissionType: permissionType,
            permissionId: permissionId,
            users: users,
            groups: groups,
            patterns: $scope.item.patterns ? $scope.item.patterns.join('\n') : ""
        };

        $scope.beforeSave = function(item) {
            if ($scope.formHelper.permissionType == "everyone") {
                item.everyone = true;
                delete item.userId;
                delete item.groupId;
            } else if ($scope.formHelper.permissionType == "group") {
                item.everyone = false;
                delete item.userId;
                item.groupId = $scope.formHelper.permissionId;
            } else if ($scope.formHelper.permissionType == "user") {
                item.everyone = false;
                item.userId = $scope.formHelper.permissionId;
                delete item.groupId;
            }

            item.patterns = $scope.formHelper.patterns.split('\n');

            return item;
        };
    }];


    /* Configuration */
    var permissionsConfig = ['$routeProvider', function($routeProvider) {
        var permissionsPath = 'permissions';

        var getAllPermissions = ['permissionResource', function(permissionResource) {
            return permissionResource.getAll();
        }];
        var getOnePermission = ['permissionResource', function(permissionResource) {
            return permissionResource.getOne();
        }];
        var getAllUsers = ['userResource', function(userResource) {
            return userResource.getAll();
        }];
        var getAllGroups = ['groupResource', function(groupResource) {
            return groupResource.getAll();
        }];

        utils.createBasicAllRoute($routeProvider, permissionsPath, { items: getAllPermissions });
        utils.createBasicOneRoute($routeProvider, permissionsPath,
                { item: getOnePermission },
                { item: getOnePermission, users: getAllUsers, groups: getAllGroups });
    }];


    /* Module setup */

    thisModule.config(permissionsConfig);
    thisModule.controller('permissionsController', permissionsController);
    thisModule.controller('permissionController', permissionController);
    thisModule.controller('permissionEditorController', permissionEditorController);

}());
