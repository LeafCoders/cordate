'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngResource', 'ngRoute'])
    .config(function ($routeProvider, $httpProvider) {
//        $routeProvider.when('/', {templateUrl:'partials/home.html', controller:HomeController});

        $routeProvider.when('/users', {templateUrl:'partials/users.html', controller:UsersController, resolve:UsersController.data});
        $routeProvider.when('/users/new', {templateUrl:'partials/userEditor.html', controller:UserEditorController, resolve:UserEditorController.data});
        $routeProvider.when('/users/:id', {templateUrl:'partials/user.html', controller:UserController, resolve:UserController.data});
        $routeProvider.when('/users/:id/edit', {templateUrl:'partials/userEditor.html', controller:UserEditorController, resolve:UserEditorController.data});

        $routeProvider.when('/groups', {templateUrl:'partials/groups.html', controller:GroupsController, resolve:GroupsController.data});
        $routeProvider.when('/groups/new', {templateUrl:'partials/groupEditor.html', controller:GroupEditorController, resolve:GroupEditorController.data});
        $routeProvider.when('/groups/:id', {templateUrl:'partials/group.html', controller:GroupController, resolve:GroupController.data});
        $routeProvider.when('/groups/:id/edit', {templateUrl:'partials/groupEditor.html', controller:GroupEditorController, resolve:GroupEditorController.data});

        $routeProvider.when('/groupMemberships', {templateUrl:'partials/groupMemberships.html', controller:GroupMembershipsController, resolve:GroupMembershipsController.data});
        $routeProvider.when('/groupMemberships/new', {templateUrl:'partials/groupMembershipEditor.html', controller:GroupMembershipEditorController, resolve:GroupMembershipEditorController.data});
        $routeProvider.when('/groupMemberships/:id', {templateUrl:'partials/groupMembership.html', controller:GroupMembershipController, resolve:GroupMembershipController.data});
        $routeProvider.when('/groupMemberships/:id/edit', {templateUrl:'partials/groupMembershipEditor.html', controller:GroupMembershipEditorController, resolve:GroupMembershipEditorController.data});

        $routeProvider.when('/permissions', {templateUrl:'partials/permissions.html', controller:PermissionsController, resolve:PermissionsController.data});
        $routeProvider.when('/permissions/new', {templateUrl:'partials/permissionEditor.html', controller:PermissionEditorController, resolve:PermissionEditorController.data});
        $routeProvider.when('/permissions/:id', {templateUrl:'partials/permission.html', controller:PermissionController, resolve:PermissionController.data});
        $routeProvider.when('/permissions/:id/edit', {templateUrl:'partials/permissionEditor.html', controller:PermissionEditorController, resolve:PermissionEditorController.data});

        $routeProvider.when('/eventweeks/current', {templateUrl:'partials/eventweek.html', controller:EventweekController, resolve:EventweekController.data});
        $routeProvider.when('/eventweeks/:id', {templateUrl:'partials/eventweek.html', controller:EventweekController, resolve:EventweekController.data});
        $routeProvider.when('/events/new', {templateUrl:'partials/eventEditor.html', controller:EventEditorController, resolve:EventEditorController.data});
        $routeProvider.when('/events/:id', {templateUrl:'partials/event.html', controller:EventController, resolve:EventController.data});
        $routeProvider.when('/events/:id/edit', {templateUrl:'partials/eventEditor.html', controller:EventEditorController, resolve:EventEditorController.data});
        $routeProvider.otherwise({redirectTo:'/eventweeks/current'});

        $httpProvider.interceptors.push('myHttpInterceptor');
    })
    .value('$anchorScroll', angular.noop);
