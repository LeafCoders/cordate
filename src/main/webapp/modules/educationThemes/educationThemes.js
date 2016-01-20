'use strict';

(function () {

    var thisModule = angular.module('educationThemes', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var lastSelectedEducationType = null;
    
    /* Controllers */

    var educationThemesController = ['$injector', '$scope', 'permissionService', 'educationThemeResource', 'educationTypes',
                                     function($injector, $scope, permissionService, educationThemeResource, educationTypes) {
        utils.extendItemsController(this, $injector, $scope, []);

        $scope.tableHeaderUrl = 'modules/educationThemes/html/educationThemesHeader.html';
        $scope.educationTypes = educationTypes;
        $scope.allowCreateItem = function() {
            return educationTypes.length > 0 && $scope.selectedEducationType ? permissionService.hasPermission('educationThemes:create:educationTypes:' + $scope.selectedEducationType.id) : false;
        };
        $scope.allowEditItem = function() {
            return educationTypes.length > 0 && $scope.selectedEducationType ? permissionService.hasPermission('educationThemes:update:educationTypes:' + $scope.selectedEducationType.id) : false;
        };

        $scope.changeEducationType = function(educationType) {
            if (educationType) {
                $scope.subTypePermission = educationType.id;
                $scope.selectedEducationType = educationType;
                lastSelectedEducationType = educationType;
                educationThemeResource.getAll({ educationTypeId: $scope.selectedEducationType.id }).then(function(data) {
                    $scope.items = data;
                });
            }
        };
 
        $scope.changeEducationType(educationTypes.length > 0 ? (lastSelectedEducationType != null ? lastSelectedEducationType : educationTypes[0]) : null);
    }];

    var educationThemeController = ['$injector', '$scope', 'permissionService', 'item', function($injector, $scope, permissionService, item) {
        utils.extendItemController(this, $injector, $scope, item);

        $scope.allowEditItem = function() {
            return permissionService.hasPermission($scope.types + ':update:' + item.id) ||
                permissionService.hasPermission($scope.types + ':update:educationTypes:' + item.educationType.id);
        };
        $scope.allowDeleteItem = function() {
            return permissionService.hasPermission($scope.types + ':delete:' + item.id) ||
                permissionService.hasPermission($scope.types + ':delete:educationTypes:' + item.educationType.id);
        };
    }];

    var educationThemeEditorController = ['$injector', '$scope', 'permissionService', 'educationThemeResource', 'item',
                                     function($injector, $scope, permissionService, educationThemeResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, educationThemeResource, item);

        item.educationType = item.educationType || lastSelectedEducationType;
        if (!item.educationType) {
            $scope.gotoList();
        }
    }];
    
    /* Configuration */
    var educationThemesConfig = ['$routeProvider', function($routeProvider) {
        var educationThemesPath = 'educationThemes';

        var getOneEducationTheme = ['educationThemeResource', function(educationThemeResource) {
            return educationThemeResource.getOne();
        }];
        var getAllEducationTypes = ['educationTypeResource', function(educationTypeResource) {
            return educationTypeResource.getAll();
        }];

        utils.createBasicAllRoute($routeProvider, educationThemesPath, { educationTypes: getAllEducationTypes });
        utils.createBasicOneRoute($routeProvider, educationThemesPath, { item: getOneEducationTheme });
    }];


    /* Module setup */

    thisModule.config(educationThemesConfig);
    thisModule.controller('educationThemesController', educationThemesController);
    thisModule.controller('educationThemeController', educationThemeController);
    thisModule.controller('educationThemeEditorController', educationThemeEditorController);

}());
