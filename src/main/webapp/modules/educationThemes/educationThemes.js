'use strict';

(function () {

    var thisModule = angular.module('educationThemes', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var educationThemesController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var educationThemeController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var educationThemeEditorController = ['$injector', '$scope', 'educationThemeResource', 'item',
                                     function($injector, $scope, educationThemeResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, educationThemeResource, item);
    }];
    
    /* Configuration */
    var educationThemesConfig = ['$routeProvider', function($routeProvider) {
        var educationThemesPath = 'educationThemes';

        var getAllEducationThemes = ['educationThemeResource', function(educationThemeResource) {
            return educationThemeResource.getAll();
        }];
        var getOneEducationTheme = ['educationThemeResource', function(educationThemeResource) {
            return educationThemeResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, educationThemesPath, { items: getAllEducationThemes });
        utils.createBasicOneRoute($routeProvider, educationThemesPath, {
            item: getOneEducationTheme
        });
    }];


    /* Module setup */

    thisModule.config(educationThemesConfig);
    thisModule.controller('educationThemesController', educationThemesController);
    thisModule.controller('educationThemeController', educationThemeController);
    thisModule.controller('educationThemeEditorController', educationThemeEditorController);

}());
