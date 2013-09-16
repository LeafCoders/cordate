'use strict';

/* Controllers */

app.controller('MainController', function($rootScope, $scope, flash) {
    $scope.closeAlert = function(index) {
        flash.clearAlerts();
    }
})


// Base controllers

function ItemsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash) {
	$scope.items = items;
    $scope.backPage = currentType + 's';

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
}

function ItemController(type, $scope, $rootScope, $location, $filter, item, itemService, flash) {
    $scope.type = type;
    $rootScope.currentPage = $scope.type + 's';
    $scope.backPage = $rootScope.currentPage;
    $scope.item = item;

    $scope.remove = function(item) {
        $('#myModal').modal('hide');
        item.$remove(function() {
            flash.addAlert({ type: 'success', text: $scope.type + 'Item.alert.itemWasDeleted'});
            $location.path('/' + $scope.backPage);
        });
    };
}

function ItemEditorController(type, $scope, $rootScope, $location, $filter, item, itemService, flash) {
    angular.extend(this, new ItemController(type, $scope, $rootScope, $location, $filter, item, itemService, flash));

    $scope.beforeSave = function(item) {
        return item;
    };

    $scope.save = function() {
        var item = angular.copy($scope.item);
        item = $scope.beforeSave(item);

        if (item) {
            if (item.id == undefined) {
                itemService.save(item, function (data, headers) {
                    flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasCreated'});
                    $location.path('/' + $scope.type + 's/' + data.id);
                });
            } else {
                item.$update(function(data, headers) {
                    flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasUpdated'});
                    $location.path('/' + $scope.type + 's/' + data.id);
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


// Events
function EventweekController($scope, $rootScope, $location, $filter, $route, currentType, item, EventResource, flash) {
    angular.extend(this, new ItemsController($scope, $rootScope, $location, $filter, $route, currentType, null, flash));

    $rootScope.currentPage = 'eventweek';
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

function EventController($scope, $rootScope, $location, $filter, item, EventResource, flash) {
    angular.extend(this, new ItemController('event', $scope, $rootScope, $location, $filter, item, EventResource, flash));

    $rootScope.currentPage = 'events';
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

function EventEditorController($scope, $rootScope, $location, $filter, item, EventResource, flash) {
    angular.extend(this, new ItemEditorController('event', $scope, $rootScope, $location, $filter, item, EventResource, flash));

    $rootScope.currentPage = 'events';
    $scope.backPage = 'eventweeks/current';

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

        if (($scope.formHelper.endTimePartDate == null || $scope.formHelper.endTimePartDate == '') &&
            ($scope.formHelper.endTimePartTime == null || $scope.formHelper.endTimePartTime == '')) {
            delete item.endTime;
        } else {
            item.endTime = $scope.formHelper.endTimePartDate + ' ' + $scope.formHelper.endTimePartTime + ' Europe/Stockholm';
        }

        return item;
    };
}

EventEditorController.data = {
    item : EventController.data.item
}


// Users

function UsersController($scope, $rootScope, $location, $filter, $route, currentType, items, flash) {
    angular.extend(this, new ItemsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash));
    $rootScope.currentPage = 'users';
    $scope.type = 'user';
}

UsersController.data = {
    items : function(UserResource) {
        return UserResource.query().$promise;
    }
}

function UserController($scope, $rootScope, $location, $filter, item, UserResource, flash) {
    angular.extend(this, new ItemController('user', $scope, $rootScope, $location, $filter, item, UserResource, flash));
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

function UserEditorController($scope, $rootScope, $location, $filter, item, UserResource, flash) {
    angular.extend(this, new ItemEditorController('user', $scope, $rootScope, $location, $filter, item, UserResource, flash));

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
        }

        return item;
    }
}

UserEditorController.data = {
    item : UserController.data.item
}


// Groups

function GroupsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash) {
    angular.extend(this, new ItemsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash));
    $rootScope.currentPage = 'groups';
    $scope.type = 'group';
}

GroupsController.data = {
    items : function(GroupResource) {
        return GroupResource.query().$promise;
    }
}

function GroupController($scope, $rootScope, $location, $filter, item, GroupResource, flash) {
    angular.extend(this, new ItemController('group', $scope, $rootScope, $location, $filter, item, GroupResource, flash));
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

function GroupEditorController($scope, $rootScope, $location, $filter, item, GroupResource, flash) {
    angular.extend(this, new ItemEditorController('group', $scope, $rootScope, $location, $filter, item, GroupResource, flash));
}

GroupEditorController.data = {
    item : GroupController.data.item
}


// Group Memberships

function GroupMembershipsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash) {
    angular.extend(this, new ItemsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash));
    $rootScope.currentPage = 'groupMemberships';
    $scope.type = 'groupMembership';
}

GroupMembershipsController.data = {
    items : function(GroupMembershipResource) {
        return GroupMembershipResource.query().$promise;
    }
}

function GroupMembershipController($scope, $rootScope, $location, $filter, item, GroupMembershipResource, flash) {
    angular.extend(this, new ItemController('groupMembership', $scope, $rootScope, $location, $filter, item, GroupMembershipResource, flash));
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

function GroupMembershipEditorController($scope, $rootScope, $location, $filter, item, GroupMembershipResource, flash, users, groups) {
    angular.extend(this, new ItemEditorController('groupMembership', $scope, $rootScope, $location, $filter, item, GroupMembershipResource, flash));
    $scope.users = users;
    $scope.groups = groups;
}

GroupMembershipEditorController.data = {
    item : GroupMembershipController.data.item,
    users : UsersController.data.items,
    groups : GroupsController.data.items
}


// Permissions

function PermissionsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash) {
    angular.extend(this, new ItemsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash));
    $rootScope.currentPage = 'permissions';
    $scope.type = 'permission';
}

PermissionsController.data = {
    items : function(PermissionResource) {
        return PermissionResource.query().$promise;
    }
}

function PermissionController($scope, $rootScope, $location, $filter, item, PermissionResource, flash) {
    angular.extend(this, new ItemController('permission', $scope, $rootScope, $location, $filter, item, PermissionResource, flash));
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

function PermissionEditorController($scope, $rootScope, $location, $filter, item, users, groups, PermissionResource, flash) {
    angular.extend(this, new ItemEditorController('permission', $scope, $rootScope, $location, $filter, item, PermissionResource, flash));

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

