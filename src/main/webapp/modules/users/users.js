'use strict';

(function () {

    var thisModule = angular.module('users', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var usersController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var userController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var userEditorController = ['$injector', '$scope', 'flash', 'userResource', 'item',
                                function($injector, $scope, flash, userResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, userResource, item);
        $scope.item.password = "";
        $scope.formHelper = {
            reenteredPassword: ""
        };

        $scope.beforeSave = function(item) {
            if (item.password != $scope.formHelper.reenteredPassword) {
                flash.addAlert({ type: 'danger', text: 'userEditor.alert.passwordsNotMatching'});
                flash.showAlerts();
                flash.clearAlerts();

                item = null;

                $scope.errors['password'] = "has-error";
                $scope.errors['reenteredPassword'] = "has-error";
            }
            return item;
        };
    }];


    /* Configuration */
    var usersConfig = ['$routeProvider', function($routeProvider) {
        var usersPath = 'users';

        var getAllUsers = ['userResource', function(userResource) {
            return userResource.getAll();
        }];
        var getOneUser = ['userResource', function(userResource) {
            return userResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, usersPath, { items: getAllUsers });
        utils.createBasicOneRoute($routeProvider, usersPath, { item: getOneUser });
    }];


    /* Module setup */

    thisModule.config(usersConfig);
    thisModule.controller('usersController', usersController);
    thisModule.controller('userController', userController);
    thisModule.controller('userEditorController', userEditorController);

}());
