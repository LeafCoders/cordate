'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive("collection",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/collection.html'
        };
    }).
    directive("collectiontable",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/collectionTable.html'
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
    directive('alert',function () {
        return {
            restrict:'EA',
            templateUrl:'partials/alert.html',
            transclude:true,
            replace:true,
            scope:{
                type:'=',
                close:'&'
            }
        };
    });
