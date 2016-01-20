'use strict';

(function () {

    var thisModule = angular.module('eventSemesters', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var currentSemester = { from: null, before: null, range: null, prevLink: null, nextLink: null };
    var lastSelectedResourceType = null;

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

    var eventSemesterController = ['$injector', '$scope', '$filter', '$route', 'flash', 'permissionService', 'eventResource', 'eventTypes', 'resourceTypes', 'items',
                               function($injector, $scope, $filter, $route, flash, permissionService, eventResource, eventTypes, resourceTypes, items) {
        utils.extendItemsController(this, $injector, $scope, items);

        $scope.type = 'event';
        $scope.types = 'events';
        $scope.backPage = "eventSemesters";
        $scope.resourceTypes = resourceTypes;
        $scope.items = items;
        $scope.allowCreateItem = function() { return permissionService.hasPermission('events:create'); };
        $scope.allowImport = true;
        $scope.currentSemester = currentSemester;
        $scope.selectedResourceType = lastSelectedResourceType;

        utils.extendCreateWithModal($injector, $scope, 'event.modalTitle.create',
            function createItems() {
                var items = [];
                angular.forEach(eventTypes, function (type) {
                    if (permissionService.hasPermission('events:create:eventTypes:' + type.id)) {
                        items.push({ title: type.name, url: '/' + $scope.types + '/new?eventTypeId=' + type.id });
                    }
                });
                return items;
            }
        );

        var getFilteredItems = function() {
            if ($scope.selectedResourceType) {
                var filteredItems = [];
                angular.forEach($scope.items, function (item) {
                    angular.forEach(item.resources, function (resource) {
                        if (resource.resourceType.id == $scope.selectedResourceType.id) {
                            filteredItems.push(item);
                        }
                    });
                });
                return filteredItems;
            } else {
                return $scope.items;
            }
        };
        

        $scope.remove = function(item) {
            eventResource.getQuery().remove({ id : item.id }, function(response, headers) {
                flash.addAlert({ type: 'success', text: 'eventItems.alert.itemWasDeleted' });
                $route.reload();
            });
        };

        $scope.allowAssignResourceType = function(resource) {
            return permissionService.hasPermission('events:update:resourceTypes:' + resource.resourceType.id);
        };
        
        $scope.changeResourceType = function(resourceType) {
            lastSelectedResourceType = resourceType;
            $scope.selectedResourceType = resourceType;
            $scope.filteredItems = getFilteredItems();
        };

        $scope.filteredItems = getFilteredItems();
    }];


    /* Configuration */

    var eventSemestersConfig = ['$routeProvider', function($routeProvider) {
        var eventSemestersPath = 'eventSemesters';

        var getOneSemester = ['$route', 'eventResource', function($route, eventResource) {
            var fromDate = $route.current.pathParams.id;
            var changeToDate = null;
            if (fromDate === undefined) {
                changeToDate = currentSemester.from;
            } else if (fromDate !== 'current') {
                changeToDate = fromDate;
            }
            changeSemester(changeToDate);
            return eventResource.getAll({ from: currentSemester.from, before: currentSemester.before });
        }];

        var getAllEventTypes = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getAll();
        }];
        
        var getAllResourceTypes = ['resourceTypeResource', function(resourceTypeResource) {
            return resourceTypeResource.getAll();
        }];
        
        $routeProvider.when('/eventSemesters', {
            templateUrl: 'modules/eventSemesters/html/eventSemester.html',
            controller:  'eventSemesterController',
            resolve:     { items: getOneSemester, eventTypes: getAllEventTypes, resourceTypes: getAllResourceTypes }
        });
        $routeProvider.when('/eventSemesters/:id', {
            templateUrl: 'modules/eventSemesters/html/eventSemester.html',
            controller:  'eventSemesterController',
            resolve:     { items: getOneSemester, eventTypes: getAllEventTypes, resourceTypes: getAllResourceTypes }
        });
    }];


    /* Module setup */

    thisModule.config(eventSemestersConfig);
    thisModule.controller('eventSemesterController', eventSemesterController);

}());
