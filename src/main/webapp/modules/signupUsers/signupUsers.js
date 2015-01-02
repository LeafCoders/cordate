'use strict';

(function () {

    var thisModule = angular.module('signupUsers', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var signupUsersController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
        $scope.allowCreateItem = false;
    }];

    var signupUserController = ['$injector', '$scope', '$http', '$location', 'flash', 'item', function($injector, $scope, $http, $location, flash, item) {
        utils.extendItemController(this, $injector, $scope, item);
        
        $scope.transformToUser = function () {
            var cordateApiPath = '/cordate/api/v1-snapshot';
            $http.post(cordateApiPath + '/signupUsersTransform/' + item.id).
            success(function(data, status, headers, config) {
                flash.addAlert({ type: 'success', text: 'userEditor.alert.itemWasCreated'});
                $location.path('/signupUsers');
            }).
            error(function(data, status, headers, config) {
                var property = data[0].property;
                var text = data[0].message;

                if (property != undefined) {
                    flash.addAlert({ type: 'danger', text: text});
                    flash.showAlerts();
                    flash.clearAlerts();
                }

                $scope.errors[property] = "has-error";
            });            
        };
    }];

    var signupUserEditorController = ['$injector', '$scope', 'signupUserResource', 'item',
                                      function($injector, $scope, signupUserResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, signupUserResource, item);
    }];


    /* Configuration */
    var signupUsersConfig = ['$routeProvider', function($routeProvider) {
        var signupUsersPath = 'signupUsers';

        var getAllSignupUsers = ['signupUserResource', function(signupUserResource) {
            return signupUserResource.getAll();
        }];
        var getOneSignupUser = ['signupUserResource', function(signupUserResource) {
            return signupUserResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, signupUsersPath, { items: getAllSignupUsers });
        utils.createBasicOneRoute($routeProvider, signupUsersPath, { item: getOneSignupUser });
    }];


    /* Module setup */

    thisModule.config(signupUsersConfig);
    thisModule.controller('signupUsersController', signupUsersController);
    thisModule.controller('signupUserController', signupUserController);
    thisModule.controller('signupUserEditorController', signupUserEditorController);

}());
