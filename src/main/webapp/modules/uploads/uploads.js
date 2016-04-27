'use strict';

(function () {

    var thisModule = angular.module('uploads', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var lastSelectedFolder = null;
    
    /* Controllers */

    var uploadsController = ['$injector', '$scope', 'permissionService', 'uploadResource', 'uploadFolders',
                             function($injector, $scope, permissionService, uploadResource, uploadFolders) {
        utils.extendItemsController(this, $injector, $scope, []);

        $scope.tableHeaderUrl = 'modules/uploads/html/uploadsHeader.html';
        $scope.folders = uploadFolders;
        $scope.allowCreateItem = function() {
            return uploadFolders.length > 0 && $scope.selectedFolder ? permissionService.hasPermission('uploads:create:' + $scope.selectedFolder.id) : false;
        };
        $scope.allowEditItem = function() { return false; };
        $scope.allowDeleteItem = function(item) {
            return uploadFolders.length > 0 && $scope.selectedFolder ? permissionService.hasPermission($scope.types + ':delete:' + $scope.selectedFolder.id) : false;
        };
        
        $scope.iconImg = function (item) {
            var index = item.fileUrl.lastIndexOf('/');
            return item.fileUrl.slice(0, index) + "/icon/" + item.fileUrl.slice(index + 1);
        };
        
        $scope.changeFolder = function(folder) {
            if (folder) {
                $scope.subTypePermission = folder.id;
                $scope.selectedFolder = folder;
                lastSelectedFolder = folder;
                uploadResource.getAll({ folderId: $scope.selectedFolder.id }).then(function(data) {
                    $scope.items = data;
                });
            }
        };
 
        $scope.changeFolder(uploadFolders.length > 0 ? (lastSelectedFolder != null ? lastSelectedFolder : uploadFolders[0]) : null);
    }];

    var uploadController = ['$injector', '$scope', '$sce', 'permissionService', 'item',
                            function($injector, $scope, $sce, permissionService, item) {
        utils.extendItemController(this, $injector, $scope, item);
        $scope.allowEditItem = function() { return false; };
        $scope.allowDeleteItem = function() {
            return permissionService.hasPermission($scope.types + ':delete:' + lastSelectedFolder.id);
        };
        
        $scope.safeFileUrl = $sce.trustAsResourceUrl(item.fileUrl);
    }];

    var uploadEditorController = ['$injector', '$scope', '$timeout', 'flash', 'uploadResource', 'item',
                                  function($injector, $scope, $timeout, flash, uploadResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, uploadResource, item);

        $scope.uploadIsSupported = !!window.FileReader;
        $scope.uploadFolder = lastSelectedFolder;
        item.folderId = item.folderId || lastSelectedFolder.id;
        if (!lastSelectedFolder) {
            $scope.gotoList();
            return;
        }
        
        $scope.beforeSave = function(item) {
            item.file = $scope.item.file;
            return item;
        };

        $scope.onFileSelect = function(files) {
            flash.clearAlerts();
            flash.showAlerts();
            $scope.item.fileName = null;
            $scope.item.mimeType = null;
            $scope.item.fileData = null;
            if (files[0] != null) {
                // Validate mime type
                var allowed = false;
                for (var i = 0; i < lastSelectedFolder.mimeTypes.length; ++i) {
                    allowed |= files[0].type.indexOf(lastSelectedFolder.mimeTypes[i]) == 0;
                }

                if (allowed && $scope.uploadIsSupported) {
                    $scope.item.file = files[0];
                    $scope.item.fileName = files[0].name;
                    $scope.item.mimeType = files[0].type;
                } else {
                    flash.addAlert({ type: 'danger', text: 'upload.mimeType.notAllowed'});
                    flash.showAlerts();
                    flash.clearAlerts();
                }
            }
        };
    }];


    /* Configuration */
    var uploadsConfig = ['$routeProvider', function($routeProvider) {
        var uploadsPath = 'uploads';

        var getOneUpload = ['uploadResource', function(uploadResource) {
            return uploadResource.getOne({ folderId: lastSelectedFolder.id });
        }];
        var getUploadFolders = ['uploadFolderResource', function(uploadFolderResource) {
            return uploadFolderResource.getAll();
        }];

        utils.createBasicAllRoute($routeProvider, uploadsPath, { uploadFolders: getUploadFolders });
        utils.createBasicOneRoute($routeProvider, uploadsPath, { item: getOneUpload });
    }];


    /* Module setup */

    thisModule.config(uploadsConfig);
    thisModule.controller('uploadsController', uploadsController);
    thisModule.controller('uploadController', uploadController);
    thisModule.controller('uploadEditorController', uploadEditorController);

}());
