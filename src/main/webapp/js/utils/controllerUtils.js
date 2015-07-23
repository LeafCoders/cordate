'use strict';

var utils = utils || {};

(function () {

    utils.extendItemsController = function(base, injector, scope, items) {
        angular.extend(base, injector.invoke(ItemsController, base, { $scope: scope, items: items }));
    };

    utils.extendItemController = function(base, injector, scope, item) {
        angular.extend(base, injector.invoke(ItemController, base, { $scope: scope, item: item }));
    };

    utils.extendItemEditorController = function(base, injector, scope, itemService, item) {
        angular.extend(base, injector.invoke(ItemController, base, { $scope: scope, item: item }));
        angular.extend(base, injector.invoke(ItemEditorController, base, { $scope: scope, itemService: itemService, item: item }));
    };

    // items objects shall contain 'title' and 'url' properties
    utils.extendCreateWithModal = function(injector, scope, modalTitle, modalItems) {
        var newModalObj = {};
        var callbackFn = function(selectedItem) {
            injector.get('$location').url(selectedItem.url);
        };

        angular.extend(newModalObj, injector.invoke(selectModal, newModalObj, {
            modalTemplate: 'modules/baseUI/html/modalCreateFromList.html',
            modalTitle: modalTitle,
            modalItems: modalItems,
            callbackFn: callbackFn
        }));

        // Override default behaviour of "Create new". Shows a modal instead 
        scope.createNew = function() {
            newModalObj.showModal();
        };
    };

    utils.createSelectModal = function(injector, modalTemplate, modalTitle, modalItems, callbackFn) {
        var newModalObj = {};
        angular.extend(newModalObj, injector.invoke(selectModal, newModalObj, {
            modalTemplate: modalTemplate,
            modalTitle: modalTitle,
            modalItems: modalItems,
            callbackFn: callbackFn
        }));
        return newModalObj;
    };

    function ItemsController($scope, $location, $filter, $modal, $q, $route, permissionService, flash, items) {
        $scope.items = items;
        $scope.type = getCurrentItemType($location);
        $scope.types = $scope.type + 's';
        $scope.backPage = $scope.types;
        $scope.allowCreateItem = function() { permissionService.hasPermission($scope.types + ':create'); };
        $scope.allowEditItem = function(item) { return permissionService.hasPermission($scope.types + ':update:' + item.id); };
        $scope.allowDeleteItem = function(item) { return permissionService.hasPermission($scope.types + ':delete:' + item.id); };
        $scope.allowImport = false;

        $scope.searchFormHelper = {
        };

        $scope.showDetails = function(id) {
            $location.path('/' + $scope.types + '/' + id);
        };

        $scope.createNew = function() {
            $location.path('/' + $scope.types + '/new');
        };

        $scope.import = function() {
            $location.path('/' + $scope.types + '/import');
        };

        $scope.deleteConfirm = function(item) {
            var modalScope = $scope.$new();
            modalScope.item = item;
            var modalPromise = $modal({template: 'modules/baseUI/html/deleteModal.html', persist: true, show: false, backdrop: 'static', scope: modalScope });
            modalPromise.$promise.then(modalPromise.show);
        };

        $scope.remove = function(item) {
            item.$remove(function() {
                flash.addAlert({ type: 'success', text: $scope.type + 'Item.alert.itemWasDeleted'});
                $route.reload();
            });
        };

        // Get text from object that contains either 'text' or 'ref' property
        $scope.textOfRefOrText = function(ref, refType) {
            return refOrTextToText(ref, refType);
        };
    }

    function ItemController($scope, $location, $filter, $modal, $q, permissionService, flash, item) {
        $scope.item = item;
        $scope.type = getCurrentItemType($location);
        $scope.types = $scope.type + 's'; 
        $scope.backPage = $scope.types;
        $scope.allowEditItem = function() { return permissionService.hasPermission($scope.types + ':update:' + item.id); };
        $scope.allowDeleteItem = function() { return permissionService.hasPermission($scope.types + ':delete:' + item.id); };

        $scope.deleteConfirm = function() {
            var modalPromise = $modal({template: 'modules/baseUI/html/deleteModal.html', persist: true, show: false, backdrop: 'static', scope: $scope });
            modalPromise.$promise.then(modalPromise.show);
        };

        $scope.remove = function(item) {
            item.$remove(function() {
                flash.addAlert({ type: 'success', text: $scope.type + 'Item.alert.itemWasDeleted'});
                $location.path('/' + $scope.types);
            });
        };
    }

    function ItemEditorController($scope, $location, $filter, flash, itemService, item) {
        $scope.errors = {};
        $scope.isCreate = $location.path().endsWith('/new');
        $scope.backPage = $scope.types + ($scope.isCreate ? '' : '/' + item.id);

        $scope.beforeSave = function(item) {
            return item;
        };

        $scope.save = function() {
            $scope.errors = {};
            var item = angular.copy($scope.item);
            item = $scope.beforeSave(item);

            if (item) {
                if ($scope.isCreate) {
                    itemService.getQuery().create(item, function (data, headers) {
                        flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasCreated'});
                        $location.path('/' + $scope.types + '/' + data.id);
                    }, function(response) {
                        var property = response.data[0].property;
                        var text = response.data[0].message;

                        if (property != undefined) {
                            flash.addAlert({ type: 'danger', text: text});
                            flash.showAlerts();
                            flash.clearAlerts();
                        }

                        $scope.errors[property] = "has-error";
                    });
                } else if (item.id != undefined) {
                    item.$update(function(data, headers) {
                        flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasUpdated'});
                        $location.path('/' + $scope.types + '/' + data.id);
                    }, function(response) {
                        var property = response.data[0].property;
                        var text = response.data[0].message;

                        if (property != undefined) {
                            flash.addAlert({ type: 'danger', text: text});
                            flash.showAlerts();
                            flash.clearAlerts();
                        }

                        $scope.errors[property] = "has-error";
                    });
                }
            }
        };
    }

    /**
     * Creates a modal dialog with content from a template.
     */
    var selectModal = ['$rootScope', '$modal', 'modalTemplate', 'modalTitle', 'modalItems', 'callbackFn',
                       function($rootScope, $modal, modalTemplate, modalTitle, modalItems, callbackFn) {
        var modalScope = $rootScope.$new();
        modalScope.modalTitle = modalTitle;
        modalScope.onOk = function(selectedItem) {
            callbackFn(selectedItem);
        };

        return {
            // Show modal dialog
            showModal : function() {
                modalScope.modalItems = angular.isFunction(modalItems) ? modalItems() : modalItems;
                var modalPromise = $modal({ template: modalTemplate, show: false, backdrop: 'static', scope: modalScope });
                modalPromise.$promise.then(modalPromise.show);
            }
        };
    }];

    function getCurrentItemType(location) {
        var pattern = /\/\w+/;
        var matches = pattern.exec(location.$$path);
        var currentType = matches[0].substring(1, matches[0].length - 1);
        return currentType;
    }
    
}());
