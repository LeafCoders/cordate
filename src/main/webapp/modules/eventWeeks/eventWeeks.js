'use strict';

(function () {

    var thisModule = angular.module('eventWeeks', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var currentWeek = { from: null, before: null, range: null, prevLink: null, nextLink: null };

    function changeWeek(fromDateString) {
        var now = new Date();
        var from = fromDateString ? new Date(fromDateString) : new Date(now.setDate(now.getDate() - now.getDay() + 1));
        var before = dayOffset(from, 7);
        var including = dayOffset(from, 6);
        var prevFromDate = dayOffset(from, -7);
        currentWeek.from = from.yyyymmdd();
        currentWeek.before = before.yyyymmdd();
        currentWeek.range = from.yyyymmdd() + '-' + including.yyyymmdd();
        currentWeek.prevLink = prevFromDate.yyyymmdd();
        currentWeek.nextLink = currentWeek.before;
        
        currentWeek.days = [];
        for (var i = 0; i < 7; i++) {
            currentWeek.days[i] = { dayNumber: i, date: dayOffset(from, i).yyyymmdd() };
        }
    };

    function dayOffset(fromDate, days) {
        var date = new Date(fromDate);
        date.setDate(date.getDate() + days);
        return date;
    }
    
    /* Controllers */

    var eventWeekController = ['$injector', '$scope', '$filter', '$route', 'permissionService', 'flash', 'eventResource', 'eventTypes', 'items',
                               function($injector, $scope, $filter, $route, permissionService, flash, eventResource, eventTypes, items) {
        utils.extendItemsController(this, $injector, $scope, items);

        $scope.type = 'event';
        $scope.types = 'events';
        $scope.backPage = "eventWeeks";
        $scope.items = items;
        $scope.allowCreateItem = function() { return permissionService.hasPermission('events:create:eventTypes:*'); };
        $scope.allowImport = true;
        $scope.currentWeek = currentWeek;

        $scope.eventsPerDay = [[], [], [], [], [], [], []];
        angular.forEach(currentWeek.days, function(day) {
            angular.forEach(items, function(eventItem) {
                if (eventItem.startTime && eventItem.startTime.indexOf(day.date) >= 0) {
                    $scope.eventsPerDay[day.dayNumber].push(eventItem);
                }
            });
        });
        
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

        $scope.remove = function(item) {
            eventResource.getQuery().remove({ id : item.id }, function(response, headers) {
                flash.addAlert({ type: 'success', text: 'eventItems.alert.itemWasDeleted' });
                $route.reload();
            });
        };
    }];


    /* Configuration */

    var eventWeeksConfig = ['$routeProvider', function($routeProvider) {
        var eventWeeksPath = 'eventWeeks';

        var getOneWeek = ['$route', 'eventResource', function($route, eventResource) {
            var fromDate = $route.current.pathParams.id;
            var changeToDate = null;
            if (fromDate === undefined) {
                changeToDate = currentWeek.from;
            } else if (fromDate !== 'current') {
                changeToDate = fromDate;
            }
            changeWeek(changeToDate);
            return eventResource.getAll({ from: currentWeek.from, before: currentWeek.before });
        }];

        var getAllEventTypes = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getAll();
        }];
        
        $routeProvider.when('/eventWeeks', {
            templateUrl: 'modules/eventWeeks/html/eventWeek.html',
            controller:  'eventWeekController',
            resolve:     { items: getOneWeek, eventTypes: getAllEventTypes }
        });
        $routeProvider.when('/eventWeeks/:id', {
            templateUrl: 'modules/eventWeeks/html/eventWeek.html',
            controller:  'eventWeekController',
            resolve:     { items: getOneWeek, eventTypes: getAllEventTypes }
        });
    }];


    /* Module setup */

    thisModule.config(eventWeeksConfig);
    thisModule.controller('eventWeekController', eventWeekController);

}());
