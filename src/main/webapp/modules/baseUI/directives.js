'use strict';

(function () {

    var thisModule = angular.module('baseUI');

    thisModule.directive("items", function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'modules/baseUI/html/items.html'
        };
    });

    // Use item-transclude instead of ng-transclude to access directive scope 
    thisModule.directive('itemTransclude', function () {
        return function (scope, element, attrs, ctrl, $transclude) {
            $transclude(scope, function (content) {
                element.append(content);
            });
        };
    });    
    
    thisModule.directive("itemstable", function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'modules/baseUI/html/itemsTable.html'
        };
    });

    thisModule.directive("item", function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'modules/baseUI/html/item.html'
        };
    });

    thisModule.directive("itemeditor", function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'modules/baseUI/html/itemEditor.html'
        };
    });

    thisModule.directive("deleteModal", function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'modules/baseUI/html/deleteModal.html'
        };
    });

    thisModule.directive("deleteAllModal", function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'modules/baseUI/html/deleteAllModal.html'
        };
    });

    thisModule.directive("search", function () {
        return {
            restrict:'E',
            transclude:true,
            templateUrl:'modules/baseUI/html/search.html'
        };
    });

    thisModule.directive('fileselect', [ '$parse', '$timeout', function($parse, $timeout) {
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
    }]);

    thisModule.directive("formitem", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.label + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<div item-transclude></div>' +
                    '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("textinput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                var autofocus = tAttrs.autofocus != undefined ? " autofocus" : "";
                return '' +
                '<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                  '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                  '<div class="col-xs-8 col-sm-6"><input type="text" class="form-control" id="form-' + tAttrs.itemName + '" ng-model="item.' + tAttrs.itemName + '"' + autofocus + '/></div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("textareainput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                var autofocus = tAttrs.autofocus != undefined ? " autofocus" : "";
                return '' +
                '<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                  '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                  '<div class="col-xs-8 col-sm-6"><textarea class="form-control" id="form-' + tAttrs.itemName + '" ng-model="item.' + tAttrs.itemName + '"' + autofocus + '/></div>' +
                '</div>';
            }
        };
    });

    /**
     * item-name | Name of item to show data for
     * form-label | Text to use as label
     * ifexist | Set to true if <textview> only shall be visible if date != null
     * msgPrefix | Will use value of 'itemName' as lookup from text strings 
     */
    thisModule.directive("textview", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: function(tElement, tAttrs) {
                var ifExist = tAttrs.ifexist != null ? ' ng-show="item.' + tAttrs.itemName + '"' : '';
                var formLabel = '\'formLabel.' + (tAttrs.formLabel ? tAttrs.formLabel : tAttrs.itemName) + '\'';
                var value = tAttrs.msgPrefix != null ? '\'' + tAttrs.msgPrefix + '.\' + item.' + tAttrs.itemName + ' | t' : 'item.' + tAttrs.itemName;
                return '' +
                '<div class="form-group"' + ifExist + '>' +
                    '<label class="col-xs-4 col-sm-2 control-label">{{ ' + formLabel + ' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<p class="form-control-static">{{ ' + value + ' }} <span item-transclude></span></p>' +
                    '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("checkboxinput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                var autofocus = tAttrs.autofocus != undefined ? " autofocus" : "";
                return '' +
                '<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                  '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                  '<div class="col-xs-8 col-sm-6"><input type="checkbox" class="form-control" id="form-' + tAttrs.itemName + '" ng-model="item.' + tAttrs.itemName + '"' + autofocus + '/></div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("timeinput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                var autofocus = tAttrs.autofocus != undefined ? " autofocus" : "";
                return '' +
                '<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                    '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                    '<div class="col-xs-5 col-sm-3"><input type="text" class="form-control" id="form-' + tAttrs.itemName + '" ng-model="formHelper.' + tAttrs.itemName + 'PartDate" bs-datepicker data-start-week="1" data-date-type="string" data-date-format="yyyy-MM-dd" data-autoclose="true" data-use-native="true" ' + autofocus + '></div>' +
                    '<div class="col-xs-3 col-sm-2"><input type="text" class="form-control" ng-model="formHelper.' + tAttrs.itemName + 'PartTime" bs-timepicker data-time-type="string" data-time-format="HH:mm" data-use-native="true"></div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("timeview", function () {
        return {
            restrict:'E',
            replace:true,
            transclude:false,
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-2 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                    '<p class="form-control-static">{{ item.' + tAttrs.itemName + ' | cordateDate }} {{ item.' + tAttrs.itemName + ' | cordateTime }}</p>' +
                    '</div>' +
                '</div>';
            }
        };
    });

}());
