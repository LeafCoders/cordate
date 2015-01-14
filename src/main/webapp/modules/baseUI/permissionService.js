'use strict';

(function () {

    var thisModule = angular.module('baseUI');

    var permissionService = ['permissionResource', function(permissionResource) {
        var userPermissions = [];
        var testedPermissions = {};

        this.init = function(callbackFn) {
            permissionResource.permissionsForUser().
                success(function(data) {
                    userPermissions = data;
                    callbackFn(true);
                }).
                error(function(data) {
                    callbackFn(false);
                });            
        };
 
        this.hasPermission = function(permissionsToTest) {
            return permissionsToTest.split(',').some(function (testPermission, index, array) {
                if (testedPermissions[testPermission] !== undefined) return testedPermissions[testPermission];
                var testParts = testPermission.split(':');
                var isPermitted = userPermissions.some(function (userPermission, index, array) {
                    var userParts = userPermission.split(':');
                    if (userParts.length > testParts.length) return false;
                    for (var i = 0; i < userParts.length; i++) {
                        if (userParts[i] != '*' && userParts[i] != testParts[i]) return false; 
                    }
                    return true;
                });
                if (testParts.length < 3) {
                    testedPermissions[testPermission] = isPermitted;
                }
                return isPermitted;
            });
        };
    }];

    thisModule.service('permissionService', permissionService);
    
}());
