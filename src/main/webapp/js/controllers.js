'use strict';

/* Controllers */

app.controller('MainController', function($rootScope, $scope, flash) {
    $scope.closeAlert = function(index) {
        flash.removeAlert();
    }
});


// Base controllers

function CollectionController($scope, $rootScope, $location, currentType, items, flash) {
	$scope.items = items;

    $scope.showDetails = function(id) {
		$location.path('/' + $scope.type + 's/' + id);
	};
	
	$scope.createNew = function() {
		$location.path('/' + $scope.type + 's/new');
	};
}

CollectionController.resolveCollection = {
    items : function($q, $route, $location, $resource, currentType) {
        var deferred = $q.defer();
        var Resource = $resource('/cordate/api/v1-snapshot/:collection/:id', {collection: currentType() + 's', id:'@id'}, {update: {method:'PUT'}});
        var items = Resource.query(function() {
            deferred.resolve(items);
        });
        return deferred.promise;
    }
};

function ItemController($scope, $rootScope, $location, item, itemService, flash) {
    $rootScope.currentPage = $scope.type + 's';
    $scope.backPage = $rootScope.currentPage;

    $scope.item = item;

    $scope.save = function() {
        if ($scope.item.id == undefined) {
            itemService.save(item, function (data, headers) {
                flash.showAlertAfterRedirect({ type: 'info', text: 'Success'});
                $location.path('/' + $scope.type + 's/' + data.id);
            }, function (response) {
                var property = response.data[0].property;
                var text = response.data[0].message;

                flash.showAlert({ type: 'error', text: property + ' ' + text});
            });
        } else {
            $scope.item.$update(function(data, headers) {
                $location.path('/' + $scope.type + 's/' + data.id);
            });
        }

    };

    $scope.remove = function() {
        var confirmed = confirm('Are you sure you want to delete this ' + $scope.type + '?');
        if (confirmed) {
            $scope.item.$remove(function() {
                $location.path('/' + $scope.type + 's');
            });
        }
    };
}

ItemController.resolveItem = {
    item : function($q, $route, $location, $resource) {
        var deferred = $q.defer();
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
            deferred.resolve(model);
        } else {
            var collection = $location.$$path.substring(1, $location.$$path.indexOf('/', 1));
            var Resource = $resource('/cordate/api/v1-snapshot/:collection/:id', {collection: collection, id:'@id'}, {update: {method:'PUT'}});
            var item = Resource.get({id: $route.current.pathParams.id}, function() {
                deferred.resolve(item);
            });
        }
        return deferred.promise;
    },
    itemService : function($location, $resource) {
        var collection = $location.$$path.substring(1, $location.$$path.indexOf('/', 1));
        return $resource('/cordate/api/v1-snapshot/:collection/:id', {collection: collection, id:'@id'}, {update: {method:'PUT'}});
    }
};


// Home

function HomeController($location) {
    $location.path('/eventweek');
}


// Users

function UsersController($scope, $rootScope, $location, currentType, items) {
    angular.extend(this, new CollectionController($scope, $rootScope, $location, currentType, items));
    $rootScope.currentPage = 'users';
    $scope.type = 'user';
}

UsersController.data = {
    items : function(UserResource) {
        return UserResource.query().$promise;
    }
};

function UserController($scope, $rootScope, $location, item, UserResource, flash) {
    $scope.type = 'user';
    angular.extend(this, new ItemController($scope, $rootScope, $location, item, UserResource, flash));
}

UserController.data = {
    item : function($q, $route, rosetteResource) {
        if ($route.current.pathParams.id != undefined) {
            return rosetteResource('users').get({id: $route.current.pathParams.id}).$promise;
        }
    },
    itemService : function(rosetteResource) {
        return rosetteResource('users');
    }
};


// Groups

function GroupsController($scope, $rootScope, $location, currentType, items) {
    angular.extend(this, new CollectionController($scope, $rootScope, $location, currentType, items));
    $rootScope.currentPage = 'groups';
    $scope.type = 'group';
}

GroupsController.data = {
    items : function($q, rosetteResource) {
        var deferred = $q.defer();
        var resource = rosetteResource('groups');
        var items = resource.query(function() {
            deferred.resolve(items);
        });
        return deferred.promise;
    }
};

function GroupController($scope, $rootScope, $location, item, itemService, flash) {
    $scope.type = 'group';
    angular.extend(this, new ItemController($scope, $rootScope, $location, item, itemService, flash));
}

GroupController.data = {
    item : function($q, $route, rosetteResource) {
        var deferred = $q.defer();
        if ($route.current.pathParams.id == undefined) {
            var item = {};
            deferred.resolve(item);
        } else {
            var resource = rosetteResource('groups');
            var item = resource.get({id: $route.current.pathParams.id}, function() {
                deferred.resolve(item);
            });
        }
        return deferred.promise;
    },
    itemService : function(rosetteResource) {
        return rosetteResource('groups');
    }
};


// Group Memberships

function GroupMembershipsController($scope, $rootScope, $location, currentType, items, users, groups) {
    angular.extend(this, new CollectionController($scope, $rootScope, $location, currentType, items));
    $rootScope.currentPage = 'groupMemberships';
    $scope.type = 'groupMembership';
    $scope.users = users;
}

GroupMembershipsController.data = {
    items : function($q, rosetteResource) {
        var deferred = $q.defer();
        var resource = rosetteResource('groupMemberships');
        var items = resource.query(function() {
            deferred.resolve(items);
        });
        return deferred.promise;
    },
    users : UsersController.data.items,
    groups : GroupsController.data.items
};

function GroupMembershipController($scope, $rootScope, $location, item, itemService, flash, users, groups) {
    $scope.type = 'groupMembership';
    $scope.users = users;
    $scope.groups = groups;
    angular.extend(this, new ItemController($scope, $rootScope, $location, item, itemService, flash));
}

GroupMembershipController.data = {
    item : function($q, $route, rosetteResource) {
        var deferred = $q.defer();
        if ($route.current.pathParams.id == undefined) {
            var item = {};
            deferred.resolve(item);
        } else {
            var resource = rosetteResource('groupMemberships');
            var item = resource.get({id: $route.current.pathParams.id}, function() {
                deferred.resolve(item);
            });
        }
        return deferred.promise;
    },
    itemService : function(rosetteResource) {
        return rosetteResource('groupMemberships');
    },
    users : UsersController.data.items,
    groups : GroupsController.data.items
};


// Permissions

function PermissionsController($scope, $rootScope, $location, currentType, items) {
    angular.extend(this, new CollectionController($scope, $rootScope, $location, currentType, items));
    $rootScope.currentPage = 'permissions';
    $scope.type = 'permission';
}

PermissionsController.data = {
    items : function($q, rosetteResource) {
        var deferred = $q.defer();
        var resource = rosetteResource('permissions');
        var items = resource.query(function() {
            deferred.resolve(items);
        });
        return deferred.promise;
    }
};

function PermissionController($scope, $rootScope, $location, item, itemService, flash) {
    $scope.type = 'permission';
    angular.extend(this, new ItemController($scope, $rootScope, $location, item, itemService, flash));
}

PermissionController.data = {
    item : function($q, $route, rosetteResource) {
        var deferred = $q.defer();
        if ($route.current.pathParams.id == undefined) {
            var item = {};
            deferred.resolve(item);
        } else {
            var resource = rosetteResource('permissions');
            var item = resource.get({id: $route.current.pathParams.id}, function() {
                deferred.resolve(item);
            });
        }
        return deferred.promise;
    },
    itemService : function(rosetteResource) {
        return rosetteResource('permissions');
    }
};


// Events

function EventWeekController($scope, $rootScope, $location, item, flash) {
    var type = 'event';
	$rootScope.currentPage = 'eventweek';
	$scope.type = type;
	$scope.item = item;
    $scope.backPage = $rootScope.currentPage;

    $scope.showDetails = function(id) {
        $location.path('/' + type + 's/' + id);
    };

    $scope.createNew = function() {
        $location.path('/' + type + 's/new');
    };
}

EventWeekController.resolveEventweek = {
    item : function($q, $route, $resource) {
        var deferred = $q.defer();
        var Resource = $resource('/cordate/api/v1-snapshot/eventweek/:id', {id:'@id'}, {update: {method:'PUT'}});
        var item = Resource.get({id: $route.current.pathParams.id}, function(data, headers) {
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

function EventItemController($scope, $rootScope, $location, currentType, item, itemService, flash, $filter) {
    var type = currentType();

    $rootScope.currentPage = type + 's';
    $scope.type = type;
    $scope.item = item;
    $scope.backPage = 'eventweek';

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
            itemService.save(item, function (data, headers) {
                flash.showAlertAfterRedirect({ type: 'info', text: 'Success!' });

                $location.path('/events/' + data.id);
            }, function (response) {
                var property = response.data[0].property;
                var text = response.data[0].message;

                flash.showAlert({ type: 'error', text: property + ' ' + text });
            });
        } else {
            item.$update(function(data, headers) {
                flash.showAlertAfterRedirect({ type: 'info', text: 'Success!' });

                $location.path('/events/' + item.id);
            }, function (response) {
                flash.showAlert({ type: 'error', text: response.data});
            });
        }
    };

    $scope.remove = function() {
        var confirmed = confirm('Are you sure you want to delete this ' + type + '?');
        if (confirmed) {
            $scope.item.$remove(function() {
                $location.path('/' + type + 's');
            });
        }
    };
}
