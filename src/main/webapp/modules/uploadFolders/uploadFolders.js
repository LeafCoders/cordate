'use strict';

(function () {

    var thisModule = angular.module('uploadFolders', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var uploadFoldersController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var uploadFolderController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var uploadFolderEditorController = ['$injector', '$scope', 'uploadFolderResource', 'item', function($injector, $scope, uploadFolderResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, uploadFolderResource, item);

        $scope.item.mimeTypes = $scope.item.mimeTypes ? $scope.item.mimeTypes.join('\n') : "";

        $scope.beforeSave = function(item) {
            item.mimeTypes = item.mimeTypes.split('\n');
            return item;
        };
    }];


    /* Configuration */
    var uploadFoldersConfig = ['$routeProvider', function($routeProvider) {
        var uploadFoldersPath = 'uploadFolders';

        var getAllUploadFolders = ['uploadFolderResource', function(uploadFolderResource) {
            return uploadFolderResource.getAll();
        }];
        var getOneUploadFolder = ['uploadFolderResource', function(uploadFolderResource) {
            return uploadFolderResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, uploadFoldersPath, { items: getAllUploadFolders });
        utils.createBasicOneRoute($routeProvider, uploadFoldersPath, { item: getOneUploadFolder });
    }];


    /* Module setup */

    thisModule.config(uploadFoldersConfig);
    thisModule.controller('uploadFoldersController', uploadFoldersController);
    thisModule.controller('uploadFolderController', uploadFolderController);
    thisModule.controller('uploadFolderEditorController', uploadFolderEditorController);

}());
