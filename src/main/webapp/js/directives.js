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
    }).
    directive("search",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/search.html'
        };
    }).
    directive("textinput",function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
            	var autofocus = tAttrs.autofocus != null ? " autofocus" : "";
            	return '' +
            	'<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                  '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                  '<div class="col-xs-8 col-sm-6"><input type="text" class="form-control" id="form-' + tAttrs.itemName + '" ng-model="item.' + tAttrs.itemName + '"' + autofocus + '/></div>' +
                '</div>';
            }
        };
    }).
    directive("textview",function () {
        return {
            restrict:'E',
            replace:true,
            transclude:false,
            template: function(tElement, tAttrs) {
            	return '' +
            	'<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<p class="form-control-static">{{ item.' + tAttrs.itemName + ' }}</p>' +
                    '</div>' +
                '</div>';
            }
        };
    }).
    directive("timeinput",function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
            	var autofocus = tAttrs.autofocus !== null ? " autofocus" : "";
            	return '' +
            	'<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
            		'<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
            		'<div class="col-xs-5 col-sm-3"><input type="date" class="form-control" id="form-' + tAttrs.itemName + '" ng-model="formHelper.' + tAttrs.itemName + 'PartDate" data-date-format="yyyy-mm-dd"' + autofocus + '></div>' +
            		'<div class="col-xs-3 col-sm-2"><select class="form-control" ng-model="formHelper.' + tAttrs.itemName + 'PartTime" ng-options="time.value as time.text for time in formHelper.times"></div>' +
            	'</div>';
            }
        };
    }).
    directive("timeview",function () {
        return {
            restrict:'E',
            replace:true,
            transclude:false,
            template: function(tElement, tAttrs) {
            	return '' +
            	'<div class="form-group">' +
            		'<label class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<p class="form-control-static">{{ item.' + tAttrs.itemName + ' | date }} {{ item.' + tAttrs.itemName + ' | time }}</p>' +
                    '</div>' +
            	'</div>';
            }
        };
    }).
    directive("locationrefinput",function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: { itemRef: '=' },
            controller: 'LocationRefInputController',
            templateUrl: 'partials/panelTextList.html'
        };
    }).
    directive("textrefview",function () {
        return {
            restrict:'E',
            replace:true,
            transclude:false,
            scope: { itemRef: '=', refType: '@' },
            controller: 'TextRefViewController',
            template: function(tElement, tAttrs) {
            	return '' +
            	'<div class="form-group">' +
            		'<label class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.\' + refType | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<p class="form-control-static">{{ reference }}</p>' +
                    '</div>' +
            	'</div>';
            }
        };
    });
