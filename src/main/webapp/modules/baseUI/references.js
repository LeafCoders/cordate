'use strict';

(function () {

    var thisModule = angular.module('baseUI');

    /* Controllers */
    
    function AbstractModalController($injector, $scope, modalTemplate, resource, resourceQuery) {
        var $q = $injector.get('$q');
        var $modal = $injector.get('$modal');
        var $filter = $injector.get('$filter');

        // Options
        $scope.modalTitle = "Not set";
        $scope.singleSelect = true;
        $scope.allowOptionalText = false;
        $scope.panelItems = new Array();
        $scope.errors = {};

        $scope.inputModal = {
            showModal: function() {
                $scope.errors = {};

                // Load resources
                $q.when(resource.getQuery().query(resourceQuery).$promise).then(function(resources) {
                    // Convert resources to objects with 'id' and 'text' values
                    var items = new Array();
                    var lenRes = resources.length;
                    for (var r = 0; r < lenRes; r++) {
                        items.push($scope.createIdItem(resources[r]));
                    }
                    $scope.modalItems = items;
    
                    // Select items and set optional text
                    $scope.optionalText = {};
                    var lenPanel = $scope.panelItems.length;
                    var lenModal = $scope.modalItems.length;
                    for (var p = 0; p < lenPanel; p++) {
                        if ($scope.panelItems[p].id === undefined) {
                            $scope.optionalText = { text: $scope.panelItems[p].text }; 
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
                modalPromise.$promise.then(modalPromise.show);
            },
            toggleModalItem: function(modalItem, optionalText) {
                var length = $scope.modalItems.length;
                for (var i = 0; i < length; i++) {
                    if ($scope.modalItems[i] === modalItem) {
                        modalItem.selected = !modalItem.selected;
                        if ($scope.singleSelect) {
                            $scope.optionalText = {};
                        }
                    } else if ($scope.singleSelect && $scope.modalItems[i].selected) {
                        $scope.modalItems[i].selected = false;
                    }
                }
                if (modalItem == null) {
                    $scope.optionalText = optionalText ? { text: optionalText } : {};
                }
            },
            saveModalItems: function() {
                var newPanelItems = new Array();
                var length = $scope.modalItems.length;
                for (var i = 0; i < length; i++) {
                    if ($scope.modalItems[i].selected) {
                        newPanelItems.push($scope.modalItems[i]); 
                    }
                }
                if ($scope.optionalText.text !== undefined) {
                    newPanelItems.push($scope.createTextItem($scope.optionalText.text));
                }
                $scope.inputTransform.toItem(newPanelItems);
            },
            removeItemConfirm: function() {
                var modalScope = $scope.$new();
                modalScope.remove = $scope.remove;
                var modalPromise = $modal({template: 'modules/baseUI/html/deleteModal.html', persist: true, show: false, backdrop: 'static', scope: modalScope});
                modalPromise.$promise.then(modalPromise.show);
            },
        };

        $scope.createIdItem = function(resource) {
            return $scope.resourceToItem(resource);
        };
        $scope.createTextItem = function(text) {
            return { 'text': text };
        };
    }

    var referenceInputController = ['$injector', '$scope', function($injector, $scope) {
        if ($scope.refType == undefined) {
            var uploadService = $injector.get('uploadResource');
            angular.extend(this,
                    new AbstractModalController($injector, $scope, 'modules/baseUI/html/modalImageList.html',
                            uploadService, { folderName: $scope.uploadFolderName }));

            $scope.refType = 'upload';
            $scope.labels = { inputTitle: 'formLabel.' + $scope.refType, modalTitle: 'modalLabel.image' };
            $scope.singleSelect = true;
        } else {
            var refResourceService = $injector.get($scope.refType + 'Resource');
            angular.extend(this,
                    new AbstractModalController($injector, $scope, 'modules/baseUI/html/modalTextList.html',
                            refResourceService));

            $scope.labels = { inputTitle: 'formLabel.' + $scope.refType, modalTitle: 'modalLabel.' + $scope.refType };
            $scope.singleSelect = true;
        }

        $scope.resourceToItem = function(resource) {
            switch ($scope.refType) {
                case 'group':
                    return { 'id': resource.id, 'text': resource.name };
                case 'user':
                    return { 'id': resource.id, 'text': resource.firstName + ' ' + resource.lastName };
                case 'upload':
                    return { 'id': resource.id, 'text': resource.fileName, 'fileUrl': resource.fileUrl };
                default:
                    return { 'id': resource.id, 'text': resource.name };
            }
        };

        $scope.inputTransform = {
            fromItem: function() {
                var ref = $scope.refItem;
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
            },
            toItem: function(newPanelItems) {
                $scope.panelItems = newPanelItems;
                $scope.refItem = null;
                if ($scope.panelItems.length > 0) {
                    if ($scope.singleSelect) {
                        if ($scope.panelItems[0].id != undefined) {
                            $scope.refItem = { 'idRef': $scope.panelItems[0].id };
                        } else {
                            $scope.refItem = { 'text': $scope.panelItems[0].text };
                        }
                    } else {
                        // TODO: Handle multiple references
                    }
                }
            }
        };
        
        $scope.inputTransform.fromItem();
    }];

    
    var eventResourceInputController = ['$injector', '$scope', 'eventResource', function($injector, $scope, eventResource) {
        var resourceTypeItem = $scope.resource.resourceType.referredObject;
        $scope.resourceType = resourceTypeItem.type;
        $scope.refType = resourceTypeItem.type;

        switch ($scope.resourceType) {
            case 'user':
                var userResourceService = $injector.get('userResource');
                angular.extend(this,
                        new AbstractModalController($injector, $scope, 'modules/baseUI/html/modalTextList.html',
                                userResourceService, { groupId: resourceTypeItem.group.idRef }));
                $scope.labels = { inputTitle: resourceTypeItem.name, modalTitle: 'modalLabel.userResource' };
                break;
            case 'upload':
                var uploadResourceService = $injector.get('uploadResource');
                angular.extend(this,
                        new AbstractModalController($injector, $scope, 'modules/baseUI/html/modalTextList.html',
                                uploadResourceService, { folderName: resourceTypeItem.folderName }));
                $scope.labels = { inputTitle: resourceTypeItem.name, modalTitle: 'modalLabel.uploadResource' };
                break;
        }


        $scope.singleSelect = true;
        $scope.allowOptionalText = false;

        $scope.resourceToItem = function(resource) {
            switch ($scope.resourceType) {
                case 'user':
                    return { 'id': resource.id, 'text': resource.fullName };
                case 'upload':
                    return { 'id': resource.id, 'text': resource.fileName, 'fileUrl': resource.fileUrl };
            }
        };

        $scope.inputTransform = {
            fromItem: function() {
                var resource = $scope.resource;
                var resourceType = resource.resourceType.referredObject;
                if (resource.type == 'user') {
                    $scope.singleSelect = !resourceType.multiSelect;
                    $scope.allowOptionalText = resourceType.allowText;
                    if (resource.users) {
                        angular.forEach(resource.users.refs, function(user) {
                            $scope.panelItems.push($scope.createIdItem(user.referredObject));
                        });
                        if (resource.users.text) {
                            $scope.panelItems.push($scope.createTextItem(resource.users.text));
                        }
                    }
                } else if (resource.type == 'upload') {
                    $scope.singleSelect = !resourceType.multiSelect;
                    if (resource.uploads) {
                        angular.forEach(resource.uploads, function(upload) {
                            $scope.panelItems.push($scope.createIdItem(upload.referredObject));
                        });
                    }
                }
            },
            toItem: function(newPanelItems) {
                var update = {};
                
                if ($scope.resource.type == 'user') {
                    update.users = { refs: [] };
                    angular.forEach(newPanelItems, function(panelItem) {
                        if (panelItem.id != undefined) {
                            update.users.refs.push({ 'idRef': panelItem.id });
                        } else {
                            update.users.text = panelItem.text;
                        }
                    });
                } else if ($scope.resource.type == 'upload') {
                    update.uploads = [];
                    angular.forEach(newPanelItems, function(panelItem) {
                        update.uploads.push({ 'idRef': panelItem.id });
                    });
                }

                if ($scope.assignDirectly) {
                    var sendResource = angular.copy($scope.resource);
                    angular.extend(sendResource, update);
                    eventResource.assignResource($scope.eventId, resourceTypeItem.id, sendResource).
                        success(function(data, status, headers, config) {
                            $scope.panelItems = newPanelItems;
                            angular.extend($scope.resource, update);
                        }).
                        error(function(data, status, headers, config) {
                            $scope.errors[$scope.refType] = "has-error";
                        });
                } else {
                    $scope.panelItems = newPanelItems;
                    angular.extend($scope.resource, update);
                }
            }
        };

        $scope.remove = function() {
            $scope.onRemove();
        };
        
        $scope.inputTransform.fromItem();
    }];
    
    
    thisModule.controller('referenceInputController', referenceInputController);
    thisModule.controller('eventResourceInputController', eventResourceInputController);

    
    /* Directives */

    thisModule.directive("refInput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                refItem: '=',
                refType: '@',
                allowOptionalText: '@'
            },
            controller: 'referenceInputController',
            templateUrl: 'modules/baseUI/html/panelTextList.html'
        };
    });

    thisModule.directive("imageRefInput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                refItem: '=',
                uploadFolderName: '@'
            },
            controller: 'referenceInputController',
            templateUrl: 'modules/baseUI/html/panelImageList.html'
        };
    });

    thisModule.directive("refView", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                refItem: '=',
                refType: '@'
            },
            controller: ['$scope', function($scope) {
                $scope.refText = referenceToText($scope.refItem, $scope.refType);
            }],
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.' + tAttrs.refType + '\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<p class="form-control-static">{{ refText }}</p>' +
                    '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("imageRefView", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: { refItem: '=' },
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-3 control-label">{{ \'formLabel.image\' | t }}</label>' +
                    '<div class="col-xs-8 col-sm-6">' +
                        '<div class="panel panel-default">' +
                            '<div class="panel-heading">' +
                                '<h3 class="panel-title">{{ refItem.referredObject.fileName }}</h3>' +
                            '</div>' +
                            '<img class="img-responsive" ng-src="{{ refItem.referredObject.fileUrl }}">' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }
        };
    });

    thisModule.directive("eventResourceInput", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                eventId: '@',
                resource: '=',
                showRemove: '@',
                onRemove: '&',
                assignDirectly: '@'
            },
            controller: 'eventResourceInputController',
            templateUrl: 'modules/baseUI/html/panelTextList.html'
        };
    });


    thisModule.directive("eventResourceView", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                resource: '='
            },
            controller: ['$scope', function($scope) {
                var type = $scope.resource.resourceType.referredObject.type;
                if (type == 'user' && $scope.resource.users != null) {
                    $scope.value = $scope.resource.users.refs.map(function(user) {
                        return user.referredObject.fullName;
                    }).join(', ');
                } else if (type == 'upload' && $scope.resource.uploads != null) {
                    $scope.value = $scope.resource.uploads.map(function(upload) {
                        return upload.referredObject.fileName;
                    }).join(', ');
                }
            }],
            template: function(tElement, tAttrs) {
                return '' +
                '<div class="form-group">' +
                    '<label class="col-xs-4 col-sm-3 control-label">{{ resource.resourceType.referredObject.name }}</label>' +
                    '<div class="col-xs-8 col-sm-10">' +
                        '<p class="form-control-static">{{ value }}</p>' +
                    '</div>' +
                '</div>';
            }
        };
    });

}());
