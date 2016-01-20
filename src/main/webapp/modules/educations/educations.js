'use strict';

(function () {

    var thisModule = angular.module('educations', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var lastSelectedEducationType = null;
    
    /* Controllers */

    var educationsController = ['$injector', '$scope', 'permissionService', 'educationResource', 'educationTypes',
                                function($injector, $scope, permissionService, educationResource, educationTypes) {
        utils.extendItemsController(this, $injector, $scope, []);

        $scope.tableHeaderUrl = 'modules/educations/html/educationsHeader.html';
        $scope.educationTypes = educationTypes;
        $scope.allowCreateItem = function() {
            return educationTypes.length > 0 && $scope.selectedEducationType ? permissionService.hasPermission('educations:create:educationTypes:' + $scope.selectedEducationType.id) : false;
        };
        $scope.allowEditItem = function() {
            return educationTypes.length > 0 && $scope.selectedEducationType ? permissionService.hasPermission('educations:update:educationTypes:' + $scope.selectedEducationType.id) : false;
        };

        $scope.changeEducationType = function(educationType) {
            if (educationType) {
                $scope.subTypePermission = educationType.id;
                $scope.selectedEducationType = educationType;
                lastSelectedEducationType = educationType;
                educationResource.getAll({ educationTypeId: $scope.selectedEducationType.id }).then(function(data) {
                    $scope.items = data;
                });
            }
        };
 
        $scope.changeEducationType(educationTypes.length > 0 ? (lastSelectedEducationType != null ? lastSelectedEducationType : educationTypes[0]) : null);
        
    }];

    var educationController = ['$injector', '$scope', '$sce', 'permissionService', 'item', function($injector, $scope, $sce, permissionService, item) {
        utils.extendItemController(this, $injector, $scope, item);
        
        if (item.recording) {
            $scope.safeRecordingUrl = $sce.trustAsResourceUrl(item.recording.fileUrl);
        }

        $scope.allowEditItem = function() {
            return permissionService.hasPermission($scope.types + ':update:' + item.id) ||
                permissionService.hasPermission($scope.types + ':update:educationTypes:' + item.educationType.id);
        };
        $scope.allowDeleteItem = function() {
            return permissionService.hasPermission($scope.types + ':delete:' + item.id) ||
                permissionService.hasPermission($scope.types + ':delete:educationTypes:' + item.educationType.id);
        };
    }];

    var educationEditorController = ['$injector', '$scope', '$filter', 'educationResource', 'item',
                                     function($injector, $scope, $filter, educationResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, educationResource, item);

        item.educationType = item.educationType || lastSelectedEducationType;
        if (!item.educationType) {
            $scope.gotoList();
            return;
        }

        $scope.formHelper = {
            timePartDate: $filter('cordateDate')(item.time),
            timePartTime: $filter('cordateTime')(item.time),
        };

        $scope.beforeSave = function(item) {
            if (!$scope.formHelper.timePartDate || !$scope.formHelper.timePartTime) {
                item.time = null;
            } else {
                item.time = $scope.formHelper.timePartDate + ' ' + $scope.formHelper.timePartTime + ' Europe/Stockholm';
            }
            return item;
        };
    }];
    
    /* Configuration */
    var educationsConfig = ['$routeProvider', function($routeProvider) {
        var educationsPath = 'educations';

        var getOneEducation = ['educationResource', function(educationResource) {
            return educationResource.getOne();
        }];
        var getAllEducationTypes = ['educationTypeResource', function(educationTypeResource) {
            return educationTypeResource.getAll();
        }];
        
        utils.createBasicAllRoute($routeProvider, educationsPath, { educationTypes: getAllEducationTypes });
        utils.createBasicOneRoute($routeProvider, educationsPath, { item: getOneEducation });
    }];


    /* Module setup */

    thisModule.config(educationsConfig);
    thisModule.controller('educationsController', educationsController);
    thisModule.controller('educationController', educationController);
    thisModule.controller('educationEditorController', educationEditorController);

}());
