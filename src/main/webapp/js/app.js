'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngResource', '$strap.directives']).
    config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {templateUrl:'partials/home.html', controller:HomeController});

    $routeProvider.when('/users', {templateUrl:'partials/users.html', controller:UsersController, resolve:UsersController.data});
    $routeProvider.when('/users/new', {templateUrl:'partials/userEditor.html', controller:UserController, resolve:UserController.data});
    $routeProvider.when('/users/:id', {templateUrl:'partials/user.html', controller:UserController, resolve:UserController.data});
    $routeProvider.when('/users/:id/edit', {templateUrl:'partials/userEditor.html', controller:UserController, resolve:UserController.data});

    $routeProvider.when('/groups', {templateUrl:'partials/groups.html', controller:GroupsController, resolve:GroupsController.data});
    $routeProvider.when('/groups/new', {templateUrl:'partials/groupEditor.html', controller:GroupController, resolve:GroupController.data});
    $routeProvider.when('/groups/:id', {templateUrl:'partials/group.html', controller:GroupController, resolve:GroupController.data});
    $routeProvider.when('/groups/:id/edit', {templateUrl:'partials/groupEditor.html', controller:GroupController, resolve:GroupController.data});

    $routeProvider.when('/permissions', {templateUrl:'partials/permissions.html', controller:PermissionsController, resolve:PermissionsController.data});
    $routeProvider.when('/permissions/new', {templateUrl:'partials/permissionEditor.html', controller:PermissionController, resolve:PermissionController.data});
    $routeProvider.when('/permissions/:id', {templateUrl:'partials/permission.html', controller:PermissionController, resolve:PermissionController.data});
    $routeProvider.when('/permissions/:id/edit', {templateUrl:'partials/permissionEditor.html', controller:PermissionController, resolve:PermissionController.data});

    $routeProvider.when('/eventweek', {templateUrl:'partials/eventweek.html', controller:EventWeekController, resolve:EventWeekController.resolveEventweek});
    $routeProvider.when('/eventweek/:id', {templateUrl:'partials/eventweek.html', controller:EventWeekController, resolve:EventWeekController.resolveEventweek});
    $routeProvider.when('/events/new', {templateUrl:'partials/eventEditor.html', controller:EventItemController, resolve:ItemController.resolveItem});
    $routeProvider.when('/events/:id', {templateUrl:'partials/event.html', controller:EventItemController, resolve:ItemController.resolveItem});
    $routeProvider.when('/events/:id/edit', {templateUrl:'partials/eventEditor.html', controller:EventItemController, resolve:ItemController.resolveItem});
    $routeProvider.otherwise({redirectTo:'/'});
}]).
    value('$anchorScroll', angular.noop);
