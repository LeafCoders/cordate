'use strict';

(function () {

    var thisModule = angular.module('uploads', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var lastSelectedFolder = null;
    
    /* Controllers */

    var uploadsController = ['$injector', '$scope', '$location', 'uploadResource', 'uploadFolders',
                             function($injector, $scope, $location, uploadResource, uploadFolders) {
        utils.extendItemsController(this, $injector, $scope, []);

        $scope.tableHeaderUrl = 'modules/uploads/html/uploadsHeader.html';
        $scope.folders = uploadFolders;
        $scope.selectedFolder = uploadFolders.length > 0 ? (lastSelectedFolder != null ? lastSelectedFolder : uploadFolders[0]) : null;
        $scope.allowCreateItem = uploadFolders.length > 0 ? $scope.allowCreateItem : false; 
        
        $scope.changeFolder = function(folder) {
            $scope.selectedFolder = folder;
            lastSelectedFolder = folder;
            uploadResource.getAll({ folderName: $scope.selectedFolder.name }).then(function(data) {
                $scope.items = data;
            });
        };
        
        if ($scope.selectedFolder != null) {
            uploadResource.getAll({ folderName: $scope.selectedFolder.name }).then(function(data) {
                $scope.items = data;
            });
        }
    }];

    var uploadController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
        $scope.allowEditItem = false;
    }];

    var uploadEditorController = ['$injector', '$scope', '$timeout', 'flash', 'uploadResource', 'item',
                                  function($injector, $scope, $timeout, flash, uploadResource, item) {
        item.folderName = item.folderName || currentFolder.name;

        utils.extendItemEditorController(this, $injector, $scope, uploadResource, item);
        $scope.uploadIsSupported = !!window.FileReader;

        $scope.onFileSelect = function(files) {
            flash.clearAlerts();
            flash.showAlerts();
            $scope.item.fileName = null;
            $scope.item.mimeType = null;
            $scope.item.fileData = null;
            if (files[0] != null) {
                // Validate mime type
                var allowed = false;
                for (var i = 0; i < currentFolder.mimeTypes.length; ++i) {
                    allowed |= files[0].type.indexOf(currentFolder.mimeTypes[i]) == 0;
                }

                if (allowed && $scope.uploadIsSupported) {
                    var fileReader = new FileReader();
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.item.fileData = e.target.result;
                        });
                    };
                    fileReader.onerror = function(e) {
                        $timeout(function() {
                            flash.addAlert({ type: 'danger', text: 'upload.invalidFileContent'});
                            flash.showAlerts();
                            flash.clearAlerts();
                        });
                    };
                    fileReader.readAsDataURL(files[0]);
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
            return uploadResource.getOne({ folderName: currentFolder.name });
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
