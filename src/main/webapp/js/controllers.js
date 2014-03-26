'use strict';

/* Controllers */

app.controller('MainController', function($scope, flash) {
    $scope.closeAlert = function(index) {
        flash.clearAlerts();
    }
})


// Base controllers

function ItemsController($scope, $location, $filter, $route, flash, itemType, items) {
	$scope.items = items;
	$scope.type = itemType();
    $scope.backPage = $scope.type + 's';

    $scope.searchFormHelper = {
    };

    $scope.showDetails = function(id) {
		$location.path('/' + $scope.type + 's/' + id);
	};
	
	$scope.createNew = function() {
		$location.path('/' + $scope.type + 's/new');
	};

    $scope.remove = function(item) {
        var confirmed = confirm($filter('t')($scope.type + 'Items.prompt.itemDeleteConfirmation'));
        if (confirmed) {
            item.$remove(function() {
                flash.addAlert({ type: 'success', text: $scope.type + 'Items.alert.itemWasDeleted'});
                $route.reload();
            });
        }
    };

    // Get reference(s) as text or array of texts
    $scope.getTextOfReference = function(ref, refType) {
    	return referenceToText(ref, refType);
    };
}

function ItemController($scope, $location, $filter, flash, itemType, item) {
    $scope.type = itemType();
    $scope.backPage = $scope.type + 's';
    $scope.item = item;

    $scope.remove = function(item) {
        $('#myModal').modal('hide');
        item.$remove(function() {
            flash.addAlert({ type: 'success', text: $scope.type + 'Item.alert.itemWasDeleted'});
            $location.path('/' + $scope.backPage);
        });
    };
}

function ItemEditorController($scope, $location, $filter, flash, itemType, itemService, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, itemType, item));

    $scope.errors = {};

    $scope.beforeSave = function(item) {
        return item;
    };

    $scope.save = function() {
        $scope.errors = {};
        var item = angular.copy($scope.item);
        item = $scope.beforeSave(item);

        if (item) {
            if (item.id == undefined) {
                itemService.save(item, function (data, headers) {
                    flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasCreated'});
                    $location.path('/' + $scope.type + 's/' + data.id);
                }, function(response) {
                    var property = response.data[0].property;
                    var text = response.data[0].message;

                    if (property != undefined) {
                        flash.addAlert({ type: 'danger', text: text});
                        flash.showAlerts();
                        flash.clearAlerts();
                    }

                    $scope.errors[property] = "has-error";
                });
            } else {
                item.$update(function(data, headers) {
                    flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasUpdated'});
                    $location.path('/' + $scope.type + 's/' + data.id);
                }, function(response) {
                    var property = response.data[0].property;
                    var text = response.data[0].message;

                    if (property != undefined) {
                        flash.addAlert({ type: 'danger', text: text});
                        flash.showAlerts();
                        flash.clearAlerts();
                    }

                    $scope.errors[property] = "has-error";
                });
            }
        }
    };

    $scope.remove = function() {
        var confirmed = confirm($filter('t')($scope.type + 'Editor.alert.itemDeleteConfirmation'));
        if (confirmed) {
            $scope.item.$remove(function() {
                flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasDeleted'});
                $location.path('/' + $scope.type + 's');
            });
        }
    };
}


// Home

function HomeController($location) {
    $location.path('/eventweeks/current');
}

// Users

function UsersController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
}

UsersController.data = {
    items : function(UserResource) {
        return UserResource.query().$promise;
    }
}

function UserController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
}

UserController.data = {
    item : function($route, UserResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return UserResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function UserEditorController($scope, $location, $filter, flash, ItemType, UserResource, item) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, UserResource, item));

    $scope.item.password = "";

    $scope.formHelper = {
        reenteredPassword:""
    }

    $scope.beforeSave = function(item) {
        if (item.password != $scope.formHelper.reenteredPassword) {
            flash.addAlert({ type: 'danger', text: 'userEditor.alert.passwordsNotMatching'});
            flash.showAlerts();
            flash.clearAlerts();

            item = null;

            $scope.errors['password'] = "has-error";
            $scope.errors['reenteredPassword'] = "has-error";
        }

        return item;
    }
}

UserEditorController.data = {
    item : UserController.data.item
}


// Groups

function GroupsController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
}

GroupsController.data = {
    items : function(GroupResource) {
        return GroupResource.query().$promise;
    }
}

function GroupController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
}

GroupController.data = {
    item : function($route, GroupResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return GroupResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function GroupEditorController($scope, $location, $filter, flash, ItemType, GroupResource, item) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, GroupResource, item));
}

GroupEditorController.data = {
    item : GroupController.data.item
}


// Group Memberships

function GroupMembershipsController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
}

GroupMembershipsController.data = {
    items : function(GroupMembershipResource) {
        return GroupMembershipResource.query().$promise;
    }
}

function GroupMembershipController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
}

GroupMembershipController.data = {
    item : function($route, GroupMembershipResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return GroupMembershipResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function GroupMembershipEditorController($scope, $location, $filter, flash, ItemType, GroupMembershipResource, item, users, groups) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, GroupMembershipResource, item));
    $scope.users = users;
    $scope.groups = groups;
}

GroupMembershipEditorController.data = {
    item : GroupMembershipController.data.item,
    users : UsersController.data.items,
    groups : GroupsController.data.items
}


// Permissions

function PermissionsController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
}

PermissionsController.data = {
    items : function(PermissionResource) {
        return PermissionResource.query().$promise;
    }
}

function PermissionController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
}

PermissionController.data = {
    item : function($route, PermissionResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return PermissionResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function PermissionEditorController($scope, $location, $filter, flash, ItemType, PermissionResource, item, users, groups) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, PermissionResource, item));

    var permissionType = "everyone";
    var permissionId = null;
    if ($scope.item.groupId) {
        permissionType = "group";
        permissionId = $scope.item.groupId;
    } else if ($scope.item.userId) {
        permissionType = "user";
        permissionId = $scope.item.userId;
    }

    $scope.formHelper = {
        permissionType:permissionType,
        permissionId:permissionId,
        users:users,
        groups:groups,
        patterns:$scope.item.patterns ? $scope.item.patterns.join('\n') : ""
    };

    $scope.beforeSave = function(item) {
        if ($scope.formHelper.permissionType == "everyone") {
            item.everyone = true;
            delete item.userId;
            delete item.groupId;
        } else if ($scope.formHelper.permissionType == "group") {
            item.everyone = false;
            delete item.userId;
            item.groupId = $scope.formHelper.permissionId;
        } else if ($scope.formHelper.permissionType == "user") {
            item.everyone = false;
            item.userId = $scope.formHelper.permissionId;
            delete item.groupId;
        }

        item.patterns = $scope.formHelper.patterns.split('\n');

        return item;
    }
}

PermissionEditorController.data = {
    item : PermissionController.data.item,
    users : UsersController.data.items,
    groups : GroupsController.data.items
}


// Locations

function LocationsController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
}

LocationsController.data = {
    items : function(LocationResource) {
        return LocationResource.query().$promise;
    }
}

function LocationController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
}

LocationController.data = {
    item : function($route, LocationResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return LocationResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function LocationEditorController($scope, $location, $filter, flash, ItemType, LocationResource, item) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, LocationResource, item));
}

LocationEditorController.data = {
    item : LocationController.data.item
}


// UserResourceTypes

function UserResourceTypesController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
}

UserResourceTypesController.data = {
    items : function(UserResourceTypeResource) {
        return UserResourceTypeResource.query().$promise;
    }
}

function UserResourceTypeController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
}

UserResourceTypeController.data = {
    item : function($route, UserResourceTypeResource) {
        if ($route.current.pathParams.id == undefined) {
            return {sortOrder:0};
        } else {
            return UserResourceTypeResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function UserResourceTypeEditorController($scope, $location, $filter, flash, ItemType, UserResourceTypeResource, item, groups) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, UserResourceTypeResource, item));
    $scope.formHelper = {
        "groups" : groups
    }
}

UserResourceTypeEditorController.data = {
    item : UserResourceTypeController.data.item,
    groups : GroupsController.data.items
}


// EventTypes

function EventTypesController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
}

EventTypesController.data = {
    items : function(EventTypeResource) {
        return EventTypeResource.query().$promise;
    }
}

function EventTypeController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
}

EventTypeController.data = {
    item : function($route, EventTypeResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return EventTypeResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function EventTypeEditorController($scope, $location, $filter, flash, ItemType, EventTypeResource, item) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, EventTypeResource, item));
}

EventTypeEditorController.data = {
    item : EventTypeController.data.item
}


// Events
function EventweekController($scope, $location, $filter, $route, flash, ItemType, EventResource, item) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, null));

    $scope.type = 'event';
    $scope.item = item;
    $scope.backPage = "eventweeks/current";

    $scope.remove = function(item) {
        var confirmed = confirm($filter('t')('eventItems.prompt.itemDeleteConfirmation'));
        if (confirmed) {
            EventResource.delete({id : item.id}, function(response, headers) {
                flash.addAlert({ type: 'success', text: 'eventItems.alert.itemWasDeleted'});
                $route.reload();
            });
        }
    };
}

EventweekController.data = {
    item : function($q, $route, EventweekResource) {
        var deferred = $q.defer();

        var id = $route.current.pathParams.id;
        if ($route.current.pathParams.id == undefined) {
            id = "current";
        }
        var item = EventweekResource.get({id: id}, function(data, headers) {
            var linkHeader = headers().link;
            if (linkHeader.length == 0) {
                throw new Error("input must not be of zero length");
            }
            // Split parts by comma
            var parts = linkHeader.split(',');
            var links = {};
            // Parse each part into a named link
            angular.forEach(parts, function (p) {
                var section = p.split(';');
                if (section.length != 2) {
                    throw new Error("section could not be split on ';'");
                }
                var url = section[0].replace(/<(.*)>/, '$1').trim();
                var name = section[1].replace(/rel="(.*)"/, '$1').trim();
                links[name] = url;
            });
            item.next_page = '/' + links['next'];
            item.previous_page = '/' + links['previous'];

            deferred.resolve(item);
        });
        return deferred.promise;
    }
}

function EventController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));

    $scope.backPage = 'eventweeks/current';
}

EventController.data = {
    item : function($q, $route, $location, EventResource) {
        if ($route.current.pathParams.id == undefined) {
            var model = {};
            var collection = $location.$$path.substring(1, $location.$$path.indexOf('/', 1));
            if (collection == 'events') {
                var currentTime = new Date();
                var year = currentTime.getFullYear();
                var month = currentTime.getMonth() + 1;
                var day = currentTime.getDate();
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;

                model = {startTime: year + '-' + month + '-' + day + ' 11:00 Europe/Stockholm'};
            }
            return model;
        } else {
            return EventResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function EventEditorController($scope, $location, $filter, flash, ItemType, EventResource, GroupMembershipsResource, item, eventTypes, locations, userResourceTypes) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, EventResource, item));

    $scope.backPage = 'eventweeks/current';

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

        groupMemberships[userResourceType.groupId] = GroupMembershipsResource.findByGroupId({groupId: userResourceType.groupId});
        userResources[userResourceType.id] = [];
    });

    angular.forEach(item.userResources, function (userResource) {
        userResources[userResource.userResourceTypeId] = userResource.userReferences;
    });

    $scope.formHelper = {
        startTimePartDate:$filter('date')(item.startTime),
        startTimePartTime:$filter('time')(item.startTime),
        endTimePartDate:$filter('date')(item.endTime),
        endTimePartTime:$filter('time')(item.endTime),
        times:times,
        eventTypes:eventTypes,
        eventTypeId:eventTypeId,
        locations:locations,
        locationId:locationId,
        userResourceTypes : userResourceTypes,
        requiredUserResourceTypes : requiredUserResourceTypes,
        groupMemberships : groupMemberships,
        userResources : userResources,
        userIdToAdd : null
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
    }

    $scope.removeUser = function(userIndex, userResourceTypeId) {
        if (userIndex > -1) {
            $scope.formHelper.userResources[userResourceTypeId].splice(userIndex, 1);
        }
    }

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
                        eventTypeId:eventType.id,
                        eventTypeName:eventType.name
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
                        locationId:location.id,
                        locationName:location.name
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
                    userResourceTypeId : userResourceType.id,
                    userResourceTypeName : userResourceType.name,
                    userReferences : userResources[userResourceType.id]
                });
            }
        });

        return item;
    };
}

EventEditorController.data = {
    item : EventController.data.item,
    userResourceTypes : UserResourceTypesController.data.items,
    eventTypes : EventTypesController.data.items,
    locations : LocationsController.data.items
}


// Posters

function PosterBase($scope) {
    $scope.rowClass = function(item) {
    	var now = new Date();
    	var endTime = stringToTime(item.endTime);
    	if (now > endTime) {
    		return 'label label-danger';
    	}
    	var startTime = stringToTime(item.startTime);
    	if (now > startTime) {
    		return 'label label-success';
    	}
    	return 'label label-warning';
    };
}

function PostersController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
    angular.extend(this, new PosterBase($scope));
    $scope.tableHeaderUrl = 'partials/postersHeader.html';
}

PostersController.data = {
    items : function(PosterResource) {
        return PosterResource.query().$promise;
    }
}

function PosterController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
    angular.extend(this, new PosterBase($scope));
}

PosterController.data = {
    item : function($q, $route, $location, PosterResource) {
        if ($route.current.pathParams.id == undefined) {
            var model = {};
            var collection = $location.$$path.substring(1, $location.$$path.indexOf('/', 1));
            if (collection == 'posters') {
                var currentTime = new Date();
                var year = currentTime.getFullYear();
                var month = currentTime.getMonth() + 1;
                var day = currentTime.getDate();
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;

                model = {startTime: year + '-' + month + '-' + day + ' 07:00 Europe/Stockholm', endTime: year + '-' + (month + 1) + '-' + day + ' 22:00 Europe/Stockholm', duration: 15};
            }
            return model;
        } else {
            return PosterResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function PosterEditorController($scope, $location, $filter, flash, ItemType, PosterResource, item) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, PosterResource, item));

    var times = [{text: '', value: ''}];
    for (var i = 0; i < 24; i++) {
        var hour = i < 10 ? '0' + i : '' + i;
        times.push({text: hour + ':00', value: hour + ':00'});
        times.push({text: hour + ':30', value: hour + ':30'});
    }

    $scope.formHelper = {
        startTimePartDate:$filter('date')(item.startTime),
        startTimePartTime:$filter('time')(item.startTime),
        endTimePartDate:$filter('date')(item.endTime),
        endTimePartTime:$filter('time')(item.endTime),
        duration:item.duration,
        times:times,
        durations:[{text: '10 s', value: 10}, {text: '15 s', value: 15}]
    };

    $scope.beforeSave = function(item) {
        if ($scope.formHelper.startTimePartDate == '' && $scope.formHelper.startTimePartTime == '') {
            delete item.startTime;
        } else {
            item.startTime = $scope.formHelper.startTimePartDate + ' ' + $scope.formHelper.startTimePartTime + ' Europe/Stockholm';
        }

        if ($scope.formHelper.endTimePartDate == '' && $scope.formHelper.endTimePartTime == '') {
            delete item.endTime;
        } else {
            item.endTime = $scope.formHelper.endTimePartDate + ' ' + $scope.formHelper.endTimePartTime + ' Europe/Stockholm';
        }

        item.duration = $scope.formHelper.duration;

        return item;
    };
}

PosterEditorController.data = {
    item : PosterController.data.item
}

//Bookings

function BookingBase($scope) {
    $scope.rowClass = function(item) {
    	var now = new Date();
    	var endTime = stringToTime(item.endTime);
    	if (now > endTime) {
    		return 'label label-danger';
    	}
    	var startTime = stringToTime(item.startTime);
    	if (now > startTime) {
    		return 'label label-success';
    	}
    	return 'label label-warning';
    };
}

function BookingsController($scope, $location, $filter, $route, flash, ItemType, items) {
    angular.extend(this, new ItemsController($scope, $location, $filter, $route, flash, ItemType, items));
    angular.extend(this, new BookingBase($scope));
    $scope.tableHeaderUrl = 'partials/bookingsHeader.html';
}

BookingsController.data = {
    items : function(BookingResource) {
        return BookingResource.query().$promise;
    }
}

function BookingController($scope, $location, $filter, flash, ItemType, item) {
    angular.extend(this, new ItemController($scope, $location, $filter, flash, ItemType, item));
    angular.extend(this, new BookingBase($scope));
}

BookingController.data = {
    item : function($q, $route, $location, BookingResource) {
        if ($route.current.pathParams.id == undefined) {
            var model = {};
            var collection = $location.$$path.substring(1, $location.$$path.indexOf('/', 1));
            if (collection == 'bookings') {
                var currentTime = new Date();
                var year = currentTime.getFullYear();
                var month = currentTime.getMonth() + 1;
                var day = currentTime.getDate();
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;

                model = {startTime: year + '-' + month + '-' + day + ' 08:00 Europe/Stockholm', endTime: year + '-' + month + '-' + day + ' 12:00 Europe/Stockholm', location: null};
            }
            return model;
        } else {
            return BookingResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
}

function BookingEditorController($scope, $location, $filter, flash, ItemType, BookingResource, item) {
    angular.extend(this, new ItemEditorController($scope, $location, $filter, flash, ItemType, BookingResource, item));

    var times = [{text: '', value: ''}];
    for (var i = 0; i < 24; i++) {
        var hour = i < 10 ? '0' + i : '' + i;
        times.push({text: hour + ':00', value: hour + ':00'});
        times.push({text: hour + ':30', value: hour + ':30'});
    }

    $scope.formHelper = {
        startTimePartDate:$filter('date')(item.startTime),
        startTimePartTime:$filter('time')(item.startTime),
        endTimePartDate:$filter('date')(item.endTime),
        endTimePartTime:$filter('time')(item.endTime),
        times:times
    };

    $scope.beforeSave = function(item) {
        if ($scope.formHelper.startTimePartDate == '' && $scope.formHelper.startTimePartTime == '') {
            delete item.startTime;
        } else {
            item.startTime = $scope.formHelper.startTimePartDate + ' ' + $scope.formHelper.startTimePartTime + ' Europe/Stockholm';
        }

        if ($scope.formHelper.endTimePartDate == '' && $scope.formHelper.endTimePartTime == '') {
            delete item.endTime;
        } else {
            item.endTime = $scope.formHelper.endTimePartDate + ' ' + $scope.formHelper.endTimePartTime + ' Europe/Stockholm';
        }

        item.duration = $scope.formHelper.duration;
        return item;
    };
}

BookingEditorController.data = {
    item : BookingController.data.item
}

// Modal

function ModalController($scope, $q, $modal, resource) {
    // Options
    $scope.modalTitle = "Not set";
    $scope.singleSelect = true;
    $scope.allowOptionalText = false;
    $scope.panelItems = new Array();

    $scope.showModal = function() {
        // Load resources
        $q.when(resource.query().$promise).then(function(resources) {
            // Convert resources to objects with 'id' and 'title' values
            var items = new Array();
            var lenRes = resources.length;
            for (var r = 0; r < lenRes; r++) {
                items.push($scope.createIdItem(resources[r]));
            }
            $scope.modalItems = items;

            // Select items and set optional text
            $scope.optionalText = '';
            var lenPanel = $scope.panelItems.length;
            var lenModal = $scope.modalItems.length;
            for (var p = 0; p < lenPanel; p++) {
                if ($scope.panelItems[p].id === undefined) {
                    $scope.optionalText = $scope.panelItems[p].title; 
                } else {
                    for (var m = 0; m < lenModal; m++) {
                        if ($scope.panelItems[p].id === $scope.modalItems[m].id) {
                            $scope.modalItems[m].selected = true;
                        }
                    }
                }
            }
        });

        // Show modal dialog
        var modalPromise = $modal({template: 'partials/modalTextList.html', persist: true, show: false, backdrop: 'static', scope: $scope});
        $q.when(modalPromise).then(function(modalElem) {
            modalElem.modal('show');
        });
    };

    $scope.toggleModalItem = function(modalItem) {
        var length = $scope.modalItems.length;
        for (var i = 0; i < length; i++) {
            if ($scope.modalItems[i] === modalItem) {
                modalItem.selected = !modalItem.selected;
                if ($scope.singleSelect) {
                    $scope.optionalText = '';
                }
            } else if ($scope.singleSelect && $scope.modalItems[i].selected) {
                $scope.modalItems[i].selected = false;
            }
        }
    };

    $scope.saveModalItems = function() {
        var newPanelItems = new Array();
        var length = $scope.modalItems.length;
        for (var i = 0; i < length; i++) {
            if ($scope.modalItems[i].selected) {
                newPanelItems.push($scope.modalItems[i]); 
            }
        }
        if ($scope.optionalText !== '') {
            newPanelItems.push($scope.createTextItem($scope.optionalText));
        }
        $scope.panelItems = newPanelItems;
        $scope.setReferences();
    };

    $scope.loadReferences = function() {
        var ref = $scope.itemRef;
        if (ref !== null) {
            if (Array.isArray(ref)) {
                // TODO: Handle multiple references
            } else {
                if (ref.referredObject !== null) {
                    $scope.panelItems.push($scope.createIdItem(ref.referredObject));
                } else if (ref.text !== null) {
                    $scope.panelItems.push($scope.createTextItem(ref.text));
                }
            }
        }
    }

    $scope.setReferences = function() {
        $scope.itemRef = null;
        if ($scope.panelItems.length > 0) {
            if ($scope.singleSelect) {
                if ($scope.panelItems[0].id !== undefined) {
                    $scope.itemRef = { 'idRef': $scope.panelItems[0].id };
                } else {
                    $scope.itemRef = { 'text': $scope.panelItems[0].title };
                }
            } else {
                // TODO: Handle multiple references
            }
        }
    }

    $scope.createIdItem = function(resource) {
        return { 'id': resource.id, 'title': $scope.resourceTitle(resource) };
    }
    $scope.createTextItem = function(title) {
        return { 'title': title };
    }
}

function LocationRefInputController($scope, $q, $modal, LocationResource) {
    angular.extend(this, new ModalController($scope, $q, $modal, LocationResource));

    $scope.refType = 'location';
    $scope.modalTitle = 'location';
    $scope.singleSelect = true;
    $scope.allowOptionalText = true;

    $scope.resourceTitle = function(resource) {
	    return resource.name;
	}
    $scope.loadReferences();
}

function TextRefViewController($scope) {
    $scope.reference = referenceToText($scope.itemRef, $scope.refType);
}
