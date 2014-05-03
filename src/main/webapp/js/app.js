'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngResource', 'ngRoute', '$strap.directives'])
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

        $routeProvider.when('/locations', {templateUrl:'partials/locations.html', controller:LocationsController, resolve:LocationsController.data});
        $routeProvider.when('/locations/new', {templateUrl:'partials/locationEditor.html', controller:LocationEditorController, resolve:LocationEditorController.data});
        $routeProvider.when('/locations/:id', {templateUrl:'partials/location.html', controller:LocationController, resolve:LocationController.data});
        $routeProvider.when('/locations/:id/edit', {templateUrl:'partials/locationEditor.html', controller:LocationEditorController, resolve:LocationEditorController.data});
        
        $routeProvider.when('/userResourceTypes', {templateUrl:'partials/userResourceTypes.html', controller:UserResourceTypesController, resolve:UserResourceTypesController.data});
        $routeProvider.when('/userResourceTypes/new', {templateUrl:'partials/userResourceTypeEditor.html', controller:UserResourceTypeEditorController, resolve:UserResourceTypeEditorController.data});
        $routeProvider.when('/userResourceTypes/:id', {templateUrl:'partials/userResourceType.html', controller:UserResourceTypeController, resolve:UserResourceTypeController.data});
        $routeProvider.when('/userResourceTypes/:id/edit', {templateUrl:'partials/userResourceTypeEditor.html', controller:UserResourceTypeEditorController, resolve:UserResourceTypeEditorController.data});

        $routeProvider.when('/eventTypes', {templateUrl:'partials/eventTypes.html', controller:EventTypesController, resolve:EventTypesController.data});
        $routeProvider.when('/eventTypes/new', {templateUrl:'partials/eventTypeEditor.html', controller:EventTypeEditorController, resolve:EventTypeEditorController.data});
        $routeProvider.when('/eventTypes/:id', {templateUrl:'partials/eventType.html', controller:EventTypeController, resolve:EventTypeController.data});
        $routeProvider.when('/eventTypes/:id/edit', {templateUrl:'partials/eventTypeEditor.html', controller:EventTypeEditorController, resolve:EventTypeEditorController.data});

        $routeProvider.when('/eventWeeks/current', {templateUrl:'partials/eventWeek.html', controller:EventWeekController, resolve:EventWeekController.data});
        $routeProvider.when('/eventWeeks/:id', {templateUrl:'partials/eventWeek.html', controller:EventWeekController, resolve:EventWeekController.data});
        $routeProvider.when('/events/new', {templateUrl:'partials/eventEditor.html', controller:EventEditorController, resolve:EventEditorController.data});
        $routeProvider.when('/events/:id', {templateUrl:'partials/event.html', controller:EventController, resolve:EventController.data});
        $routeProvider.when('/events/:id/edit', {templateUrl:'partials/eventEditor.html', controller:EventEditorController, resolve:EventEditorController.data});

        $routeProvider.when('/posters', {templateUrl:'partials/posters.html', controller:PostersController, resolve:PostersController.data});
        $routeProvider.when('/posters/new', {templateUrl:'partials/posterEditor.html', controller:PosterEditorController, resolve:PosterEditorController.data});
        $routeProvider.when('/posters/:id', {templateUrl:'partials/poster.html', controller:PosterController, resolve:PosterController.data});
        $routeProvider.when('/posters/:id/edit', {templateUrl:'partials/posterEditor.html', controller:PosterEditorController, resolve:PosterEditorController.data});

        $routeProvider.when('/bookings', {templateUrl:'partials/bookings.html', controller:BookingsController, resolve:BookingsController.data});
        $routeProvider.when('/bookings/new', {templateUrl:'partials/bookingEditor.html', controller:BookingEditorController, resolve:BookingEditorController.data});
        $routeProvider.when('/bookings/import', {templateUrl:'partials/bookingsImportEditor.html', controller:BookingsImportEditorController, resolve:BookingsImportEditorController.data});
        $routeProvider.when('/bookings/:id', {templateUrl:'partials/booking.html', controller:BookingController, resolve:BookingController.data});
        $routeProvider.when('/bookings/:id/edit', {templateUrl:'partials/bookingEditor.html', controller:BookingEditorController, resolve:BookingEditorController.data});

        $routeProvider.when('/uploads', {templateUrl:'partials/uploads.html', controller:UploadsController, resolve:UploadsController.data});
        $routeProvider.when('/uploads/new', {templateUrl:'partials/uploadEditor.html', controller:UploadEditorController, resolve:UploadEditorController.data});
        $routeProvider.when('/uploads/:id', {templateUrl:'partials/upload.html', controller:UploadController, resolve:UploadController.data});
        $routeProvider.when('/uploads/:id/edit', {templateUrl:'partials/uploadEditor.html', controller:UploadEditorController, resolve:UploadEditorController.data});

        $routeProvider.otherwise({redirectTo:'/eventWeeks/current'});
        
        $httpProvider.interceptors.push('myHttpInterceptor');
    })
    .value('$anchorScroll', angular.noop);
