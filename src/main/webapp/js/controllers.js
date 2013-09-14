'use strict';

/* Controllers */

app.controller('MainController', function($rootScope, $scope, flash) {
    $scope.closeAlert = function(index) {
        flash.clearAlerts();
    }
});


// Base controllers

function ItemsController($scope, $rootScope, $location, $filter, $route, currentType, items, flash) {
	$scope.items = items;

    $scope.showDetails = function(id) {
		$location.path('/' + $scope.type + 's/' + id);
	};
	
	$scope.createNew = function() {
		$location.path('/' + $scope.type + 's/new');
	};

    $scope.remove = function(item) {
        var confirmed = confirm($filter('t')('items.itemDeleteConfirmation.' + $scope.type));
        if (confirmed) {
            item.$remove(function() {
                flash.addAlert({ type: 'success', text: 'items.itemDeleted.' + $scope.type});
                $route.reload();
            });
        }
    };
}

function ItemController($scope, $rootScope, $location, $filter, item, itemService, flash) {
    $rootScope.currentPage = $scope.type + 's';
    $scope.backPage = $rootScope.currentPage;

    $scope.item = item;

    $scope.save = function() {
        if ($scope.item.id == undefined) {
            itemService.save(item, function (data, headers) {
                flash.addAlert({ type: 'success', text: 'itemEditor.itemCreated.' + $scope.type});
                $location.path('/' + $scope.type + 's/' + data.id);
            });
        } else {
            $scope.item.$update(function(data, headers) {
                flash.addAlert({ type: 'success', text: 'itemEditor.itemUpdated.' + $scope.type});
                $location.path('/' + $scope.type + 's/' + data.id);
            });
        }

    };

    $scope.remove = function() {
        var confirmed = confirm($filter('t')('itemEditor.itemDeleteConfirmation.' + $scope.type));
        if (confirmed) {
            $scope.item.$remove(function() {
                flash.addAlert({ type: 'success', text: 'itemEditor.itemDeleted.' + $scope.type});
                $location.path('/' + $scope.type + 's');
            });
        }
    };
}


// Home

function HomeController($location) {
    alert('nisse');
    $location.path('/eventweeks/current');
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
};

function UserController($scope, $rootScope, $location, $filter, item, UserResource, flash) {
    $scope.type = 'user';
    angular.extend(this, new ItemController($scope, $rootScope, $location, $filter, item, UserResource, flash));
}

UserController.data = {
    item : function($route, UserResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return UserResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
};


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
};

function GroupController($scope, $rootScope, $location, $filter, item, GroupResource, flash) {
    $scope.type = 'group';
    angular.extend(this, new ItemController($scope, $rootScope, $location, $filter, item, GroupResource, flash));
}

GroupController.data = {
    item : function($route, GroupResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return GroupResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
};


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
};

function GroupMembershipController($scope, $rootScope, $location, $filter, item, GroupMembershipResource, flash, users, groups) {
    $scope.type = 'groupMembership';
    $scope.users = users;
    $scope.groups = groups;
    angular.extend(this, new ItemController($scope, $rootScope, $location, $filter, item, GroupMembershipResource, flash));
}

GroupMembershipController.data = {
    item : function($route, GroupMembershipResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return GroupMembershipResource.get({id: $route.current.pathParams.id}).$promise;
        }
    },
    users : UsersController.data.items,
    groups : GroupsController.data.items
};


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
};

function PermissionController($scope, $rootScope, $location, $filter, item, PermissionResource, flash) {
    $scope.type = 'permission';
    angular.extend(this, new ItemController($scope, $rootScope, $location, $filter, item, PermissionResource, flash));
}

PermissionController.data = {
    item : function($route, PermissionResource) {
        if ($route.current.pathParams.id == undefined) {
            return {};
        } else {
            return PermissionResource.get({id: $route.current.pathParams.id}).$promise;
        }
    }
};


// Events

function EventweekController($scope, $rootScope, $location, $filter, $route, item, EventResource, flash) {
    var type = 'event';
	$rootScope.currentPage = 'eventweek';
	$scope.type = type;
	$scope.item = item;
    $scope.backPage = "eventweeks/current";

    $scope.showDetails = function(id) {
        $location.path('/' + type + 's/' + id);
    };

    $scope.createNew = function() {
        $location.path('/' + type + 's/new');
    };

    $scope.remove = function(item) {
        var confirmed = confirm($filter('t')('items.itemDeleteConfirmation.' + $scope.type));
        if (confirmed) {
            EventResource.delete({id : item.id}, function(response, headers) {
                flash.addAlert({ type: 'success', text: 'items.itemDeleted.' + $scope.type});
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
};

function EventController($scope, $rootScope, $location, $filter, currentType, item, EventResource, flash) {
    var type = currentType();

    $rootScope.currentPage = type + 's';
    $scope.type = type;
    $scope.item = item;
    $scope.backPage = 'eventweeks/current';

    $scope.item.startTimePartDate = $filter('date')(item.startTime);
    $scope.item.startTimePartTime = $filter('time')(item.startTime);
    $scope.item.endTimePartDate = $filter('date')(item.endTime);
    $scope.item.endTimePartTime = $filter('time')(item.endTime);

    var times = [{text: '', value: ''}];
    for (var i = 0; i < 24; i++) {
        var hour = i < 10 ? '0' + i : '' + i;
        times.push({text: hour + ':00', value: hour + ':00'});
        times.push({text: hour + ':30', value: hour + ':30'});
    }
    $scope.times = times;

    $scope.save = function() {
        var item = angular.copy($scope.item);

        if (item.startTimePartDate == '' && item.startTimePartTime == '') {
            delete item.startTime;
        } else {
            item.startTime = item.startTimePartDate + ' ' + item.startTimePartTime + ' Europe/Stockholm';
        }
        delete item.startTimePartDate;
        delete item.startTimePartTime;

        if ((item.endTimePartDate == null || item.endTimePartDate == '') &&
            (item.endTimePartTime == null || item.endTimePartTime == '')) {
            delete item.endTime;
        } else {
            item.endTime = item.endTimePartDate + ' ' + item.endTimePartTime + ' Europe/Stockholm';
        }
        delete item.endTimePartDate;
        delete item.endTimePartTime;


        if (item.id == undefined) {
            EventResource.save(item, function (data, headers) {
                flash.addAlert({ type: 'success', text: 'itemEditor.itemCreated.event'});
                $location.path('/events/' + data.id);
            });
        } else {
            item.$update(function(data, headers) {
                flash.addAlert({ type: 'success', text: 'itemEditor.itemUpdated.event'});
                $location.path('/events/' + item.id);
            });
        }
    };

    $scope.remove = function() {
        var confirmed = confirm($filter('t')('itemEditor.itemDeleteConfirmation.event'));
        if (confirmed) {
            $scope.item.$remove(function() {
                flash.addAlert({ type: 'success', text: 'itemEditor.itemDeleted.event'});
                $location.path('/' + type + 's');
            });
        }
    };
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
};
