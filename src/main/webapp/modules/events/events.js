'use strict';

(function () {

    var thisModule = angular.module('events', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var eventController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
        $scope.backPage = 'eventWeeks/current';
    }];

    var eventEditorController = ['$injector', '$scope', '$filter', 'eventResource', 'groupMembershipResource',
                                 'item', 'eventTypes', 'locations', 'userResourceTypes',
                                 function($injector, $scope, $filter, eventResource, groupMembershipResource,
                                         item, eventTypes, locations, userResourceTypes) {
        utils.extendItemEditorController(this, $injector, $scope, eventResource, item);
        $scope.backPage = 'eventWeeks/current';

        var times = [{text: '', value: ''}];
        for (var i = 0; i < 24; i++) {
            var hour = i < 10 ? '0' + i : '' + i;
            times.push({text: hour + ':00', value: hour + ':00'});
            times.push({text: hour + ':30', value: hour + ':30'});
        }

        var eventTypeId = null;
        if (item.eventType != null && item.eventType.eventTypeId != null) {
            eventTypeId = item.eventType.eventTypeId;
        }

        var locationId = null;
        if (item.location != null && item.location.locationId != null) {
            locationId = item.location.locationId;
        }

        var requiredUserResourceTypes = {};
        var groupMemberships = {};
        var userResources = {};

        angular.forEach(userResourceTypes, function (userResourceType) {
            if ($.inArray(userResourceType.name, item.requiredUserResourceTypes) != -1) {
                requiredUserResourceTypes[userResourceType.name] = true;
            } else {
                requiredUserResourceTypes[userResourceType.name] = false;
            }

            groupMemberships[userResourceType.groupId] = groupMembershipResource.getQuery().findByGroupId({groupId: userResourceType.groupId});
            userResources[userResourceType.id] = [];
        });

        angular.forEach(item.userResources, function (userResource) {
            userResources[userResource.userResourceTypeId] = userResource.userReferences;
        });

        $scope.formHelper = {
            startTimePartDate: $filter('date')(item.startTime),
            startTimePartTime: $filter('time')(item.startTime),
            endTimePartDate: $filter('date')(item.endTime),
            endTimePartTime: $filter('time')(item.endTime),
            times: times,
            eventTypes: eventTypes,
            eventTypeId: eventTypeId,
            locations: locations,
            locationId: locationId,
            userResourceTypes: userResourceTypes,
            requiredUserResourceTypes: requiredUserResourceTypes,
            groupMemberships: groupMemberships,
            userResources: userResources,
            userIdToAdd: null
        };

        $scope.addUser = function(userId, userResourceType) {
            if (userId != null) {

                var userToAdd = null;

                angular.forEach(groupMemberships[userResourceType.groupId], function (groupMembership) {
                    if (groupMembership.userId == userId) {
                        userToAdd = {
                            "userId" : groupMembership.userId,
                            "userFullName" : groupMembership.userFullName
                        };
                    }
                });

                if (userToAdd != null) {
                    $scope.formHelper.userResources[userResourceType.id].push(userToAdd);
                }
            }
            $scope.formHelper.userIdToAdd = null;
        };

        $scope.removeUser = function(userIndex, userResourceTypeId) {
            if (userIndex > -1) {
                $scope.formHelper.userResources[userResourceTypeId].splice(userIndex, 1);
            }
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

            if ($scope.formHelper.eventTypeId != null) {
                angular.forEach(eventTypes, function(eventType) {
                    if (eventType.id == $scope.formHelper.eventTypeId) {
                        item.eventType = {
                            eventTypeId: eventType.id,
                            eventTypeName: eventType.name
                        };
                    }
                });
            } else {
                item.eventType = null;
            }

            if ($scope.formHelper.locationId != null) {
                angular.forEach(locations, function(location) {
                    if (location.id == $scope.formHelper.locationId) {
                        item.location = {
                            locationId: location.id,
                            locationName: location.name
                        };
                    }
                });
            } else {
                item.location = null;
            }

            item.requiredUserResourceTypes = [];
            angular.forEach($scope.formHelper.requiredUserResourceTypes, function(value, key) {
                if (value) {
                    item.requiredUserResourceTypes.push(key);
                }
            });

            item.userResources = [];
            angular.forEach(userResourceTypes, function(userResourceType) {
                if ($scope.formHelper.requiredUserResourceTypes[userResourceType.name] &&
                    userResources[userResourceType.id] !== 'undefined' &&
                    userResources[userResourceType.id] !== null &&
                    userResources[userResourceType.id].length > 0) {
                    item.userResources.push({
                        userResourceTypeId: userResourceType.id,
                        userResourceTypeName: userResourceType.name,
                        userReferences: userResources[userResourceType.id]
                    });
                }
            });

            return item;
        };
    }];


    /* Configuration */
    var eventsConfig = ['$routeProvider', function($routeProvider) {
        var eventsPath = 'events';

        var getOneEvent = ['eventResource', function(eventResource) {
            return eventResource.getOne();
        }];
        var getAllUserResourceTypes = ['userResourceTypeResource', function(userResourceTypeResource) {
            return userResourceTypeResource.getAll();
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
            userResourceTypes: getAllUserResourceTypes,
            eventTypes: getAllEventTypes,
            locations: getAllLocations
        };
        utils.createBasicOneRoute($routeProvider, eventsPath, resolveShow, resolveEdit);
    }];


    /* Module setup */

    thisModule.config(eventsConfig);
    thisModule.controller('eventController', eventController);
    thisModule.controller('eventEditorController', eventEditorController);

}());
