'use strict';

(function () {

    var thisModule = angular.module('educations', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var educationsController = ['$injector', '$scope', 'permissionService', 'items', 'educationTypes',
                                function($injector, $scope, permissionService, items, educationTypes) {
        utils.extendItemsController(this, $injector, $scope, items);

        utils.extendCreateWithModal($injector, $scope, 'education.modalTitle.create',
            function createItems() {
                var items = [];
                angular.forEach(educationTypes, function (type) {
                    if (permissionService.hasPermission('educations:create:educationTypes:' + type.id)) {
                        items.push({ title: type.name, url: '/' + $scope.types + '/new?educationTypeId=' + type.id });
                    }
                });
                return items;
            }
        );
    }];

    var educationController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var educationEditorController = ['$injector', '$scope', 'educationResource', 'item', 'selectedEducationType',
                                     function($injector, $scope, educationResource, item, selectedEducationType) {
        utils.extendItemEditorController(this, $injector, $scope, educationResource, item);
        
        if (!item.type) {
            item.type = 'event';
        }

        if (selectedEducationType && selectedEducationType.id) {
            item.educationType = selectedEducationType;
        }
    }];
    
    /* Configuration */
    var educationsConfig = ['$routeProvider', function($routeProvider) {
        var educationsPath = 'educations';

        var getAllEducations = ['educationResource', function(educationResource) {
            return educationResource.getAll();
        }];
        var getOneEducation = ['educationResource', function(educationResource) {
            return educationResource.getOne();
        }];
        var getAllEducationTypes = ['educationTypeResource', function(educationTypeResource) {
            return educationTypeResource.getAll();
        }];
        var getOneEducationType = ['educationTypeResource', function(educationTypeResource) {
            return educationTypeResource.getOneUseParamAsId('educationTypeId');
        }];

        utils.createBasicAllRoute($routeProvider, educationsPath, {
            items: getAllEducations,
            educationTypes: getAllEducationTypes
        });
        utils.createBasicOneRoute($routeProvider, educationsPath, {
            item: getOneEducation,
            selectedEducationType: getOneEducationType
        });
    }];


    /* Module setup */

    thisModule.config(educationsConfig);
    thisModule.controller('educationsController', educationsController);
    thisModule.controller('educationController', educationController);
    thisModule.controller('educationEditorController', educationEditorController);

}());
