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

    var permissionEditorController = ['$injector', '$scope', 'permissionResource', 'item',
                                      function($injector, $scope, permissionResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, permissionResource, item);

        var permissionType = "everyone";
        var permissionId = null;
        if ($scope.item.group) {
            permissionType = "group";
            permissionId = $scope.item.group.id;
        } else if ($scope.item.user) {
            permissionType = "user";
            permissionId = $scope.item.user.id;
        }

        $scope.formHelper = {
            permissionType: permissionType,
            permissionId: permissionId,
        };

        $scope.item.patterns = $scope.item.patterns ? $scope.item.patterns.join('\n') : "";
        
        $scope.beforeSave = function(item) {
            if ($scope.formHelper.permissionType === "everyone") {
                item.everyone = true;
            } else {
                delete item.everyone;
            }
            if ($scope.formHelper.permissionType !== "group") {
                delete item.group;
            }
            if ($scope.formHelper.permissionType !== "user") {
                delete item.user;
            }

            item.patterns = item.patterns.split('\n');
            return item;
        };
    }];


    /* Filters */

    var commonPermissionsFilter = function() {
        return function(items, scope) {
            var arrayToReturn = [];
            angular.forEach(items, function(item) {
                if (item.everyone == true) {
                    arrayToReturn.push(item);
                }
            });
            return arrayToReturn;
        };
    };

    var groupPermissionsFilter = function() {
        return function(items, scope) {
            var arrayToReturn = [];
            angular.forEach(items, function(item) {
                if (item.group) {
                    arrayToReturn.push(item);
                }
            });
            return arrayToReturn;
        };
    };

    var userPermissionsFilter = function() {
        return function(items, scope) {
            var arrayToReturn = [];
            angular.forEach(items, function(item) {
                if (item.user) {
                    arrayToReturn.push(item);
                }
            });
            return arrayToReturn;
        };
    };
    

    /* Configuration */
    var permissionsConfig = ['$routeProvider', function($routeProvider) {
        var permissionsPath = 'permissions';

        var getAllPermissions = ['permissionResource', function(permissionResource) {
            return permissionResource.getAll();
        }];
        var getOnePermission = ['permissionResource', function(permissionResource) {
            return permissionResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, permissionsPath, { items: getAllPermissions });
        utils.createBasicOneRoute($routeProvider, permissionsPath, { item: getOnePermission });
    }];


    /* Module setup */

    thisModule.config(permissionsConfig);
    thisModule.controller('permissionsController', permissionsController);
    thisModule.controller('permissionController', permissionController);
    thisModule.controller('permissionEditorController', permissionEditorController);
    thisModule.filter('commonPermissions', commonPermissionsFilter); 
    thisModule.filter('groupPermissions', groupPermissionsFilter); 
    thisModule.filter('userPermissions', userPermissionsFilter); 

}());
