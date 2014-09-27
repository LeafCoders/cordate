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
        angular.extend(base, injector.invoke(ItemEditorController, base, { $scope: scope, itemService: itemService, item: item }));
    };

    function ItemsController($scope, $location, $filter, $route, flash, items) {
        $scope.items = items;
        $scope.type = getCurrentItemType($location);
        $scope.backPage = $scope.type + 's';
        $scope.allowEditItem = true;
        $scope.allowImport = false;

        $scope.searchFormHelper = {
        };

        $scope.showDetails = function(id) {
            $location.path('/' + $scope.type + 's/' + id);
        };

        $scope.createNew = function() {
            $location.path('/' + $scope.type + 's/new');
        };

        $scope.import = function() {
            $location.path('/' + $scope.type + 's/import');
        };

        $scope.remove = function(item) {
            var confirmed = confirm($filter('t')($scope.type + 'Items.prompt.itemDeleteConfirmation'));
            if (confirmed) {
                item.$remove(function() {
                    flash.addAlert({ type: 'success', text: $scope.type + 'Items.alert.itemWasDeleted'});
                    $route.reload();
                });
            }
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

    function ItemController($scope, $location, $filter, flash, item) {
        $scope.item = item;
        $scope.type = getCurrentItemType($location);
        $scope.backPage = $scope.type + 's';
        $scope.allowEditItem = true;

        $scope.remove = function(item) {
            $('#myModal').modal('hide');
            item.$remove(function() {
                flash.addAlert({ type: 'success', text: $scope.type + 'Item.alert.itemWasDeleted'});
                $location.path('/' + $scope.backPage);
            });
        };
    }

    function ItemEditorController($scope, $location, $filter, flash, itemService, item) {
        angular.extend(this, new ItemController($scope, $location, $filter, flash, item));

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
                if (item.id == undefined) {
                    itemService.getQuery().save(item, function (data, headers) {
                        flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasCreated'});
                        $location.path('/' + $scope.type + 's/' + data.id);
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
                } else {
                    item.$update(function(data, headers) {
                        flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasUpdated'});
                        $location.path('/' + $scope.type + 's/' + data.id);
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

        $scope.remove = function() {
            var confirmed = confirm($filter('t')($scope.type + 'Editor.alert.itemDeleteConfirmation'));
            if (confirmed) {
                $scope.item.$remove(function() {
                    flash.addAlert({ type: 'success', text: $scope.type + 'Editor.alert.itemWasDeleted'});
                    $location.path('/' + $scope.type + 's');
                });
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
