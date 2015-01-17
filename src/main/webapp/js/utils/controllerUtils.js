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

    utils.extendCreateWithModal = function(base, injector, scope, modalTemplate, title, items) {
        angular.extend(base, injector.invoke(CreateWithModal, base, {
            $scope: scope,
            modalTemplate: modalTemplate,
            title: title,
            items: angular.isFunction(items) ? items() : items
        }));

        // Override default behaviour of "Create new". Shows a model instead 
        scope.createNew = function() {
            scope.createModal.showModal();
        };
    };

    function ItemsController($scope, $location, $filter, $modal, $q, $route, flash, items) {
        $scope.items = items;
        $scope.type = getCurrentItemType($location);
        $scope.types = $scope.type + 's'; 
        $scope.backPage = $scope.types;
        $scope.allowCreateItem = true;
        $scope.allowEditItem = true;
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

        $scope.removeConfirm = function(item) {
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

        // Get reference(s) as text or array of texts
        $scope.getTextOfReference = function(ref, refType) {
            return referenceToText(ref, refType);
        };

        // Get reference object
        $scope.getReference = function(item, param) {
            var ref = referenceToObject(item);
            if (ref != null) {
                return ref[param];
            }
            return null;
        };
    }

    function ItemController($scope, $location, $filter, $modal, $q, flash, item) {
        $scope.item = item;
        $scope.type = getCurrentItemType($location);
        $scope.types = $scope.type + 's'; 
        $scope.backPage = $scope.types;
        $scope.allowEditItem = true;

        $scope.removeConfirm = function() {
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
     * Shows a modal dialog with content from a template.
     * All items in 'items' must contain a 'params' property like { ..., params: 'type=user&age=12&name=Kalle' }
     */
    function CreateWithModal($scope, $location, $modal, modalTemplate, title, items) {
        $scope.createModal = {
            modalTitle: title,
            modalItems : items,

            // Show modal dialog
            showModal : function() {
                var modalPromise = $modal({template: modalTemplate, show: false, backdrop: 'static', scope: $scope});
                modalPromise.$promise.then(modalPromise.show);
            },
    
            // Calls new url, with params from selected item, when user clicks an item
            create : function(item) {
                $location.url('/' + $scope.types + '/new?' + item.params);
            }
        };
    }
    
    function getCurrentItemType(location) {
        var pattern = /\/\w+/;
        var matches = pattern.exec(location.$$path);
        var currentType = matches[0].substring(1, matches[0].length - 1);
        return currentType;
    }
    
}());
