'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngResource', '$strap.directives']).
    config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {templateUrl:'partials/home.html', controller:HomeController});

    var items = ['user', 'group', 'permission'];
    angular.forEach(items, function (item) {
        $routeProvider.when('/' + item + 's', {templateUrl:'partials/' + item + 's.html', controller:CollectionController, resolve:CollectionController.resolveCollection});
        $routeProvider.when('/' + item + 's/new', {templateUrl:'partials/' + item + 'Editor.html', controller:ItemController, resolve:ItemController.resolveItem});
        $routeProvider.when('/' + item + 's/:id', {templateUrl:'partials/' + item + '.html', controller:ItemController, resolve:ItemController.resolveItem});
        $routeProvider.when('/' + item + 's/:id/edit', {templateUrl:'partials/' + item + 'Editor.html', controller:ItemController, resolve:ItemController.resolveItem});
    });

    $routeProvider.when('/eventweek', {templateUrl:'partials/eventweek.html', controller:EventWeekController, resolve:EventWeekController.resolveEventweek});
    $routeProvider.when('/eventweek/:id', {templateUrl:'partials/eventweek.html', controller:EventWeekController, resolve:EventWeekController.resolveEventweek});
    $routeProvider.when('/events/new', {templateUrl:'partials/eventEditor.html', controller:EventItemController, resolve:ItemController.resolveItem});
    $routeProvider.when('/events/:id', {templateUrl:'partials/event.html', controller:EventItemController, resolve:ItemController.resolveItem});
    $routeProvider.when('/events/:id/edit', {templateUrl:'partials/eventEditor.html', controller:EventItemController, resolve:ItemController.resolveItem});
    $routeProvider.otherwise({redirectTo:'/'});
}]).
    value('$anchorScroll', angular.noop);
