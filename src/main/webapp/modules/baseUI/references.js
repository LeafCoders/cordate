'use strict';

(function () {

    var thisModule = angular.module('baseUI');

    /* Controllers */
    
    function AbstractModalController($scope, $q, $modal, modalTemplate, resource, resourceQuery) {
        // Options
        $scope.modalTitle = "Not set";
        $scope.singleSelect = true;
        $scope.allowOptionalText = false;
        $scope.panelItems = new Array();

        $scope.showModal = function() {
            // Load resources
            $q.when(resource.getQuery().query(resourceQuery).$promise).then(function(resources) {
                // Convert resources to objects with 'id' and 'title' values
                var items = new Array();
                var lenRes = resources.length;
                for (var r = 0; r < lenRes; r++) {
                    items.push($scope.createIdItem(resources[r]));
                }
                $scope.modalItems = items;

                // Select items and set optional text
                $scope.optionalText = '';
                var lenPanel = $scope.panelItems.length;
                var lenModal = $scope.modalItems.length;
                for (var p = 0; p < lenPanel; p++) {
                    if ($scope.panelItems[p].id === undefined) {
                        $scope.optionalText = $scope.panelItems[p].title; 
                    } else {
                        for (var m = 0; m < lenModal; m++) {
                            if ($scope.panelItems[p].id === $scope.modalItems[m].id) {
                                $scope.modalItems[m].selected = true;
                            }
                        }
                    }
                }
            });

            // Show modal dialog
            var modalPromise = $modal({template: modalTemplate, persist: true, show: false, backdrop: 'static', scope: $scope});
            $q.when(modalPromise).then(function(modalElem) {
                modalElem.modal('show');
            });
        };

        $scope.toggleModalItem = function(modalItem) {
            var length = $scope.modalItems.length;
            for (var i = 0; i < length; i++) {
                if ($scope.modalItems[i] === modalItem) {
                    modalItem.selected = !modalItem.selected;
                    if ($scope.singleSelect) {
                        $scope.optionalText = '';
                    }
                } else if ($scope.singleSelect && $scope.modalItems[i].selected) {
                    $scope.modalItems[i].selected = false;
                }
            }
        };

        $scope.saveModalItems = function() {
            var newPanelItems = new Array();
            var length = $scope.modalItems.length;
            for (var i = 0; i < length; i++) {
                if ($scope.modalItems[i].selected) {
                    newPanelItems.push($scope.modalItems[i]); 
                }
            }
            if ($scope.optionalText !== '') {
                newPanelItems.push($scope.createTextItem($scope.optionalText));
            }
            $scope.panelItems = newPanelItems;
            $scope.setReferences();
        };

        $scope.loadReferences = function() {
            var ref = $scope.itemRef;
            if (ref != null) {
                if (Array.isArray(ref)) {
                    // TODO: Handle multiple references
                } else {
                    if (ref.referredObject != null) {
                        $scope.panelItems.push($scope.createIdItem(ref.referredObject));
                    } else if (ref.text != null) {
                        $scope.panelItems.push($scope.createTextItem(ref.text));
                    } else {
                        $scope.panelItems.push($scope.createIdItem(ref));
                    }
                }
            }
        };

        $scope.setReferences = function() {
            $scope.itemRef = null;
            if ($scope.panelItems.length > 0) {
                if ($scope.singleSelect) {
                    if ($scope.panelItems[0].id != undefined) {
                        $scope.itemRef = { 'idRef': $scope.panelItems[0].id };
                    } else {
                        $scope.itemRef = { 'text': $scope.panelItems[0].title };
                    }
                } else {
                    // TODO: Handle multiple references
                }
            }
        };

        $scope.createIdItem = function(resource) {
            return $scope.resourceData(resource);
        };
        $scope.createTextItem = function(title) {
            return { 'title': title };
        };
    }

    var locationRefInputController = ['$scope', '$q', '$modal', 'locationResource', function($scope, $q, $modal, locationResource) {
        angular.extend(this,
                new AbstractModalController($scope, $q, $modal, 'modules/baseUI/html/modalTextList.html', locationResource));

        $scope.refType = 'location';
        $scope.modalTitle = 'location';
        $scope.singleSelect = true;
        $scope.allowOptionalText = true;

        $scope.resourceData = function(resource) {
            return { 'id': resource.id, 'title': resource.name };
        };
        $scope.loadReferences();
    }];

    var resourceRefInputController = ['$injector', '$scope', '$q', '$modal', function($injector, $scope, $q, $modal) {
        var resourceService = $injector.get($scope.resourceType + "Resource");
        angular.extend(this,
                new AbstractModalController($scope, $q, $modal, 'modules/baseUI/html/modalTextList.html', resourceService));

//        $scope.refType = $scope.resourceType;
        $scope.labels = { inputTitle: 'formLabel.' + $scope.resourceType, modalTitle: 'modalLabel.' + $scope.resourceType };
        $scope.singleSelect = true;
        $scope.allowOptionalText = false;

        $scope.resourceData = function(resource) {
            switch ($scope.resourceType) {
                case 'group':
                    return { 'id': resource.id, 'title': resource.name };
                case 'user':
                    return { 'id': resource.id, 'title': resource.firstName + ' ' + resource.lastName };
                    
                default:
                    return { 'id': resource.id, 'title': resource.name };
            }
        };
        $scope.loadReferences();
        
        $scope.setReferences = function() {
            $scope.itemRef = null;
            if ($scope.panelItems.length > 0) {
                if ($scope.singleSelect) {
                    $scope.itemRef = { idRef: $scope.panelItems[0].id };
                } else {
                    // TODO: Handle multiple references
                }
            }
        };
    }];

    var imageRefInputController = ['$scope', '$q', '$modal', 'uploadResource', function($scope, $q, $modal, uploadResource) {
        angular.extend(this,
                new AbstractModalController($scope, $q, $modal, 'modules/baseUI/html/modalImageList.html',
                                            uploadResource, { folderName: $scope.uploadFolderName }));

        $scope.refType = 'upload';
        $scope.modalTitle = 'image';
        $scope.singleSelect = true;

        $scope.resourceData = function(resource) {
            return { 'id': resource.id, 'title': resource.fileName, 'fileUrl': resource.fileUrl };
        };
        $scope.loadReferences();
    }];

    var textRefViewController = ['$scope', function($scope) {
        $scope.reference = referenceToText($scope.itemRef, $scope.refType);
    }];

    var objectRefViewController = ['$scope', function($scope) {
        $scope.reference = referenceToObject($scope.itemRef);
    }];

    thisModule.controller('locationRefInputController', locationRefInputController);
    thisModule.controller('resourceRefInputController', resourceRefInputController);
    thisModule.controller('imageRefInputController', imageRefInputController);
    thisModule.controller('textRefViewController', textRefViewController);
    thisModule.controller('objectRefViewController', objectRefViewController);

    
    /* Directives */

    thisModule.directive("locationrefinput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: { itemRef: '=' },
            controller: 'locationRefInputController',
            templateUrl: 'modules/baseUI/html/panelTextList.html'
        };
    });

    thisModule.directive("resourcerefinput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: { itemRef: '=', resourceType: '@' },
            controller: 'resourceRefInputController',
            templateUrl: 'modules/baseUI/html/panelTextList.html'
        };
    });

    thisModule.directive("imagerefinput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: { itemRef: '=', uploadFolderName: '@' },
            controller: 'imageRefInputController',
            templateUrl: 'modules/baseUI/html/panelImageList.html'
        };
    });

    thisModule.directive("imagerefview", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: { itemRef: '=' },
            controller: 'objectRefViewController',
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
    });

    thisModule.directive("textrefview", function () {
        return {
            restrict:'E',
            replace:true,
            transclude:false,
            scope: { itemRef: '=', refType: '@' },
            controller: 'textRefViewController',
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


}());
