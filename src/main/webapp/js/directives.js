'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive("items",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/items.html'
        };
    }).
    directive("itemstable",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/itemsTable.html'
        };
    }).
    directive("item",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/item.html'
        };
    }).
    directive("itemeditor",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/itemEditor.html'
        };
    }).
    directive("deleteModal",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/deleteModal.html'
        };
    });
