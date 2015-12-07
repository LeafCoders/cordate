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

    var educationController = ['$injector', '$scope', '$sce', 'item', function($injector, $scope, $sce, item) {
        utils.extendItemController(this, $injector, $scope, item);
        
        if (item.recording) {
            $scope.safeRecordingUrl = $sce.trustAsResourceUrl(item.recording.fileUrl);
        }
    }];

    var educationEditorController = ['$injector', '$scope', 'educationResource', 'data',
                                     function($injector, $scope, educationResource, data) {
        if (!data.item.type) {
            data.item.type = 'event';
        }

        if (data.selectedEducationType && data.selectedEducationType.id) {
            data.item.educationType = data.selectedEducationType;
        }
        
        utils.extendItemEditorController(this, $injector, $scope, educationResource, data.item);
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

        var getEditData = ['$q', 'educationResource', 'educationTypeResource', function($q, educationResource, educationTypeResource) {
            var defer = $q.defer();
            var newSelected = educationTypeResource.getOneUseParamAsId('educationTypeId');
            if (Object.keys(newSelected).length > 0) {
                newSelected.then(function (educationType) {
                    defer.resolve({
                        item: {},
                        selectedEducationType: educationType
                    });
                });
            } else {
                educationResource.getOne().then(function (education) {
                    educationTypeResource.getQuery().get({ id: education.educationType.id }).$promise.then(function (educationType) {
                        defer.resolve({
                            item: education,
                            selectedEducationType: educationType
                        });
                    });
                });
            }
            return defer.promise;
        }];

        var resolveShow = {
            item: getOneEducation
        };
        var resolveEdit = {
            data: getEditData
        };
        
        utils.createBasicAllRoute($routeProvider, educationsPath, {
            items: getAllEducations,
            educationTypes: getAllEducationTypes
        });
        utils.createBasicOneRoute($routeProvider, educationsPath, resolveShow, resolveEdit);
    }];


    /* Module setup */

    thisModule.config(educationsConfig);
    thisModule.controller('educationsController', educationsController);
    thisModule.controller('educationController', educationController);
    thisModule.controller('educationEditorController', educationEditorController);

}());
