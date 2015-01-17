'use strict';

(function () {

    var thisModule = angular.module('events', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var eventController = ['$injector', '$scope', 'permissionService', 'item',
                           function($injector, $scope, permissionService, item) {
        utils.extendItemController(this, $injector, $scope, item);
        $scope.backPage = 'eventWeeks/current';

        $scope.allowAssign = function(resource) {
            return permissionService.hasPermission('assign:resourceType:' + resource.resourceType.referredObject.id);
        };
    }];

    var eventEditorController = ['$injector', '$scope', '$filter', 'eventResource', 'eventType', 'item',
                                 function($injector, $scope, $filter, eventResource, eventType, item) {
        utils.extendItemEditorController(this, $injector, $scope, eventResource, item);
        $scope.backPage = 'eventWeeks/current';

        if (item.id == undefined) {
            $scope.item = eventsUtils.createEventFromEventType(eventType);
        }

        $scope.removeResource = function(resource) {
            $scope.item.resources.splice($scope.item.resources.indexOf(resource), 1);
        };

        $scope.formHelper = {
            startTimePartDate: $filter('cordateDate')(item.startTime),
            startTimePartTime: $filter('cordateTime')(item.startTime),
            endTimePartDate: $filter('cordateDate')(item.endTime),
            endTimePartTime: $filter('cordateTime')(item.endTime)
        };

        $scope.beforeSave = function(item) {
            if ($scope.formHelper.startTimePartDate == '' && $scope.formHelper.startTimePartTime == '') {
                delete item.startTime;
            } else {
                item.startTime = $scope.formHelper.startTimePartDate + ' ' + $scope.formHelper.startTimePartTime + ' Europe/Stockholm';
            }

            if (($scope.formHelper.endTimePartDate == null || $scope.formHelper.endTimePartDate == '') &&
                ($scope.formHelper.endTimePartTime == null || $scope.formHelper.endTimePartTime == '')) {
                delete item.endTime;
            } else {
                item.endTime = $scope.formHelper.endTimePartDate + ' ' + $scope.formHelper.endTimePartTime + ' Europe/Stockholm';
            }
            return item;
        };

    }];


    /* Configuration */
    var eventsConfig = ['$routeProvider', function($routeProvider) {
        var eventsPath = 'events';

        var getOneEvent = ['eventResource', function(eventResource) {
            return eventResource.getOne();
        }];
        var getOneEventType = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getOneUseParamAsId('eventTypeId');
        }];
        var getAllEventTypes = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getAll();
        }];
        var getAllLocations = ['locationResource', function(locationResource) {
            return locationResource.getAll();
        }];
        
        var resolveShow = {
            item: getOneEvent
        };
        var resolveEdit = {
            item: getOneEvent,
            eventType: function() { return null; }
        };
        var resolveNew = {
            item: getOneEvent,
            eventType: getOneEventType
        };
        utils.createBasicOneRoute($routeProvider, eventsPath, resolveShow, resolveEdit, resolveNew);
    }];


    /* Module setup */

    thisModule.config(eventsConfig);
    thisModule.controller('eventController', eventController);
    thisModule.controller('eventEditorController', eventEditorController);

}());
