'use strict';

(function () {

    var thisModule = angular.module('baseUI');

    // Use item-transclude instead of ng-transclude to access directive scope 
    thisModule.directive('itemTransclude', function () {
        return function (scope, element, attrs, ctrl, $transclude) {
            $transclude(scope, function (content) {
                element.append(content);
            });
        };
    });    
    
    thisModule.directive("itemsHeader", function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/baseUI/html/itemsHeader.html'
        };
    });

    thisModule.directive("itemsTable", function () {
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

    thisModule.directive("itemEditor", function () {
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

    thisModule.directive('fileSelect', ['$parse', '$timeout', function($parse, $timeout) {
        return {
            restrict: 'A',
            scope: {
                fileSelect: '&'
            },
            link: function(scope, element, attrs) {
                var selectCallback = scope.fileSelect();

                element.bind('change', function(evt) {
                    var files = [], fileList, i;
                    fileList = evt.target.files;
                    if (fileList != null) {
                        for (i = 0; i < fileList.length; i++) {
                            files.push(fileList.item(i));
                        }
                    }
                    $timeout(function() {
                        selectCallback(files);
                    });
                });
                element.bind('click', function(){
                    this.value = null;
                });
            }
        };
    }]);

    thisModule.directive('fileDropzone', ['$document', function($document) {
        return {
            restrict: 'E',
            scope: {
                onDrop: '&'
            },
            template: function(tElement, tAttrs) {
                return '<div class="file-dropzone"></div>';
            }, 
            link: function(scope, element, attrs) {
                var dropCallback = scope.onDrop();
                var elementBody = angular.element($document[0].body);
                element.css('display', 'none');

                elementBody.on('dragenter', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    element.css('display', 'block');
                    return false;
                });
                element.on('dragover', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    return false;
                });
                element.on('dragleave', function(evt) {
                    element.css('display', 'none');
                });
                element.on('drop', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    element.css('display', 'none');
                    var files = evt.originalEvent ? evt.originalEvent.dataTransfer.files : evt.dataTransfer.files;
                    dropCallback(files);
                    return false;
                });
            }
        };
    }]);
    
    thisModule.directive("formItem", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.' + tAttrs.label + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<div item-transclude></div>' +
                    '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("textInput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                var autofocus = tAttrs.autofocus != undefined ? " autofocus" : "";
                var inputType = tAttrs.type != undefined ? tAttrs.type : "text";
                return '' +
                '<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                  '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                  '<div class="col-xs-8 col-sm-6"><input type="' + inputType + '" class="form-control" id="form-' + tAttrs.itemName + '" ng-model="item.' + tAttrs.itemName + '"' + autofocus + '/></div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("textareaInput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                var autofocus = tAttrs.autofocus != undefined ? " autofocus" : "";
                return '' +
                '<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                  '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                  '<div class="col-xs-8 col-sm-6"><textarea class="form-control" id="form-' + tAttrs.itemName + '" ng-model="item.' + tAttrs.itemName + '"' + autofocus + '/></div>' +
                '</div>';
            }
        };
    });

    /**
     * item-name | Name of item to show data for
     * form-label | Text to use as label
     * ifexist | Set to true if <text-view> only shall be visible if date != null
     * msgPrefix | Will use value of 'itemName' as lookup from text strings 
     */
    thisModule.directive("textView", function () {
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
                    '<label class="col-xs-4 col-sm-3 control-label">{{ ' + formLabel + ' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<p class="form-control-static">{{ ' + value + ' }} <span item-transclude></span></p>' +
                    '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("checkboxInput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                var autofocus = tAttrs.autofocus != undefined ? " autofocus" : "";
                return '' +
                '<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                  '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                  '<div class="col-xs-8 col-sm-6">' +
                    '<div class="checkbox"><label><input type="checkbox" id="form-' + tAttrs.itemName + '" ng-model="item.' + tAttrs.itemName + '"' + autofocus + '/></label></div>' +
                  '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("checkboxView", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                  '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                  '<div class="col-xs-8 col-sm-6">' +
                    '<p class="form-control-static">{{ item.' + tAttrs.itemName + ' | cordateBool }}</p>' +
                  '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("timeInput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: function(tElement, tAttrs) {
                var autofocus = tAttrs.autofocus != undefined ? " autofocus" : "";
                return '' +
                '<div class="form-group" ng-class="errors.' + tAttrs.itemName + '">' +
                    '<label for="form-' + tAttrs.itemName + '" class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                    '<div class="col-xs-5 col-sm-3"><input type="text" class="form-control" id="form-' + tAttrs.itemName + '" ng-model="formHelper.' + tAttrs.itemName + 'PartDate" bs-datepicker data-start-week="1" data-date-type="string" data-date-format="yyyy-MM-dd" data-autoclose="true" data-use-native="true" ' + autofocus + '></div>' +
                    '<div class="col-xs-3 col-sm-2"><input type="text" class="form-control" ng-model="formHelper.' + tAttrs.itemName + 'PartTime" bs-timepicker data-time-type="string" data-time-format="HH:mm" data-use-native="true" data-length="1" data-minute-step="10" data-arrow-behavior="picker"></div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("timeView", function () {
        return {
            restrict:'E',
            replace:true,
            transclude:false,
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.' + tAttrs.itemName + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                    '<p class="form-control-static">{{ item.' + tAttrs.itemName + ' | cordateDate }} {{ item.' + tAttrs.itemName + ' | cordateTime }}</p>' +
                    '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("permission", ['permissionService', function (permissionService) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                if (!permissionService.hasPermission(attrs.permission)) {
                    element.remove();
                }
            }
        };
    }]);

    thisModule.directive("spinner", ['$timeout', function($timeout) {
        return {
            restrict : 'E',
            template : '<span class="label label-primary">Laddar...</span>',
            scope : {
                'while' : '=',
            },
            link : function(scope, elem, attrs) {
                var showTimer;
                scope.$watch('while', function(newVal) {
                    newVal ? showSpinner() : hideSpinner();
                });

                function showSpinner() {
                    if (showTimer) return;
                    showTimer = $timeout(showElement.bind(this, true), 1500);
                }

                function hideSpinner() {
                    if (showTimer) $timeout.cancel(showTimer);
                    showTimer = null;
                    showElement(false);
                }

                function showElement(show) {
                    show ? elem.css({ display : '' }) : elem.css({ display : 'none' });
                }

                showElement(false);
            }
        };
    }]);

}());
