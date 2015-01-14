'use strict';

(function () {

    var thisModule = angular.module('eventSemesters', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var currentSemester = { from: null, before: null, range: null, prevLink: null, nextLink: null };

    function changeSemester(fromDateString) {
        var now = new Date();
        var from = fromDateString ? new Date(fromDateString) : new Date(now.getFullYear(), 6*Math.floor(now.getMonth()/6), 1);
        var before = monthOffset(from, 6);
        var including = new Date(before);
        including.setDate(0);
        var prevFromDate = monthOffset(from, -6);
        currentSemester.from = from.yyyymmdd();
        currentSemester.before = before.yyyymmdd();
        currentSemester.range = from.yyyymmdd() + '-' + including.yyyymmdd();
        currentSemester.prevLink = prevFromDate.yyyymmdd();
        currentSemester.nextLink = currentSemester.before;
    };

    function monthOffset(fromDate, months) {
        var date = new Date(fromDate);
        date.setMonth(date.getMonth() + months);
        return date;
    }
    
    /* Controllers */

    var eventSemesterController = ['$injector', '$scope', '$filter', '$route', 'flash', 'permissionService', 'eventResource', 'eventTypes', 'items',
                               function($injector, $scope, $filter, $route, flash, permissionService, eventResource, eventTypes, items) {
        utils.extendItemsController(this, $injector, $scope, items);

        $scope.type = 'event';
        $scope.types = 'events';
        $scope.backPage = "eventSemesters/current";
        $scope.items = items;
        $scope.currentSemester = currentSemester;
        
        utils.extendCreateWithModal(this, $injector, $scope,
                'modules/baseUI/html/modalCreateFromList.html',
                'event.modalTitle.create',
                function () {
                    var items = [];
                    angular.forEach(eventTypes, function (type) {
                        items.push({ title: type.name, params: 'eventTypeId=' + type.id });
                    });
                    return items;
                }
        );

        $scope.remove = function(item) {
            eventResource.getQuery().remove({ id : item.id }, function(response, headers) {
                flash.addAlert({ type: 'success', text: 'eventItems.alert.itemWasDeleted' });
                $route.reload();
            });
        };
        
        $scope.allowAssign = function(resource) {
            return permissionService.hasPermission('assign:resourceType:' + resource.resourceType.referredObject.key);
        };
    }];


    /* Configuration */

    var eventSemestersConfig = ['$routeProvider', function($routeProvider) {
        var eventSemestersPath = 'eventSemesters';

        var getOneSemester = ['$route', 'eventResource', function($route, eventResource) {
            var fromDate = $route.current.pathParams.id;
            if (fromDate === undefined || fromDate == 'current') {
                changeSemester();
            } else {
                changeSemester(fromDate);
            }
            return eventResource.getAll({ from: currentSemester.from, before: currentSemester.before });
        }];

        var getAllEventTypes = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getAll();
        }];
        
        $routeProvider.when('/eventSemesters/current', {
            templateUrl: 'modules/eventSemesters/html/eventSemester.html',
            controller:  'eventSemesterController',
            resolve:     { items: getOneSemester, eventTypes: getAllEventTypes }
        });
        $routeProvider.when('/eventSemesters/:id', {
            templateUrl: 'modules/eventSemesters/html/eventSemester.html',
            controller:  'eventSemesterController',
            resolve:     { items: getOneSemester, eventTypes: getAllEventTypes }
        });
    }];


    /* Module setup */

    thisModule.config(eventSemestersConfig);
    thisModule.controller('eventSemesterController', eventSemesterController);

}());
