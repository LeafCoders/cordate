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
    directive("deleteAllModal",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/deleteAllModal.html'
        };
    }).
    directive("search",function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'partials/search.html'
        };
    }).
    directive('fileselect', [ '$parse', '$timeout', function($parse, $timeout) {
        return function(scope, elem, attr) {
            var fn = $parse(attr['fileselect']);
            elem.bind('change', function(evt) {
                var files = [], fileList, i;
                fileList = evt.target.files;
                if (fileList != null) {
                    for (i = 0; i < fileList.length; i++) {
                        files.push(fileList.item(i));
                    }
                }
                $timeout(function() {
                    fn(scope, {
                        $files : files,
                        $event : evt
                    });
                });
            });
            elem.bind('click', function(){
                this.value = null;
            });
        };
    }]).
    directive("formitem",function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.label + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<div ng-transclude></div>' +
                    '</div>' +
                '</div>';
            }
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
            restrict: 'E',
            replace: true,
            transclude: true,
            template: function(tElement, tAttrs) {
                var ifExist = tAttrs.ifexist != null ? ' ng-show="item.' + tAttrs.itemName + '"' : '';
            	return '' +
            	'<div class="form-group"' + ifExist + '>' +
                    '<label class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<p class="form-control-static">{{ item.' + tAttrs.itemName + ' }} <span ng-transclude></span></p>' +
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
    directive("imagerefinput",function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: { itemRef: '=', uploadFolderName: '@' },
            controller: 'ImageRefInputController',
            templateUrl: 'partials/panelImageList.html'
        };
    }).
    directive("imagerefview",function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: { itemRef: '=' },
            controller: 'ObjectRefController',
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.image\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<div class="panel panel-default">' +
                            '<div class="panel-heading">' +
                                '<h3 class="panel-title">{{ reference.fileName }}</h3>' +
                            '</div>' +
                            '<img class="img-responsive" ng-src="{{ reference.fileUrl }}">' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }
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
