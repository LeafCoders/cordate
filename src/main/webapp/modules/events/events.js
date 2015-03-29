'use strict';

(function () {

    var thisModule = angular.module('events', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var eventController = ['$injector', '$scope', 'permissionService', 'item',
                           function($injector, $scope, permissionService, item) {
        utils.extendItemController(this, $injector, $scope, item);
        $scope.backPage = 'eventWeeks/current';

        $scope.allowAssign = function(resource) {
            return permissionService.hasPermission('assign:resourceType:' + resource.resourceType.id);
        };
    }];

    var eventEditorController = ['$injector', '$scope', '$filter', 'eventResource', 'eventType', 'item',
                                 function($injector, $scope, $filter, eventResource, eventType, item) {
        utils.extendItemEditorController(this, $injector, $scope, eventResource, item);
        $scope.backPage = 'eventWeeks/current';

        if (item.id == undefined) {
            $scope.item = eventsUtils.createEventFromEventType(eventType);
        }

        $scope.removeResource = function(resource) {
            $scope.item.resources.splice($scope.item.resources.indexOf(resource), 1);
        };

        $scope.formHelper = {
            startTimePartDate: $filter('cordateDate')(item.startTime),
            startTimePartTime: $filter('cordateTime')(item.startTime),
            endTimePartDate: $filter('cordateDate')(item.endTime),
            endTimePartTime: $filter('cordateTime')(item.endTime)
        };

        $scope.beforeSave = function(item) {
            if ($scope.formHelper.startTimePartDate == '' && $scope.formHelper.startTimePartTime == '') {
                delete item.startTime;
            } else {
                item.startTime = $scope.formHelper.startTimePartDate + ' ' + $scope.formHelper.startTimePartTime + ' Europe/Stockholm';
            }

            if (($scope.formHelper.endTimePartDate == null || $scope.formHelper.endTimePartDate == '') &&
                ($scope.formHelper.endTimePartTime == null || $scope.formHelper.endTimePartTime == '')) {
                delete item.endTime;
            } else {
                item.endTime = $scope.formHelper.endTimePartDate + ' ' + $scope.formHelper.endTimePartTime + ' Europe/Stockholm';
            }
            return item;
        };

        $scope.selectModal = utils.createSelectModal($injector, 
            'modules/baseUI/html/modalCreateFromList.html',
            'resourceType.modalTitle.create',
            function createModalItems() {
                var items = [];
                $injector.get('resourceTypeResource').getAll().then(function(data) {
                    angular.forEach(data, function(resourceType) {
                        var alreadyAdded = false;
                        angular.forEach($scope.item.resources, function(existingResourceType) {
                            alreadyAdded |= existingResourceType.resourceType.name == resourceType.name;
                        });
                        if (!alreadyAdded) {
                            items.push({ title: resourceType.name, resourceType: resourceType });
                        }
                    });                    
                }, function(error) {
                    items.push({ title: 'Error' });
                });
                return items;
            },
            function onOk(selectedItem) {
                $scope.item.resources.push({
                    type: selectedItem.resourceType.type,
                    resourceType: selectedItem.resourceType
                });
            }
        );
    }];

    var eventsImportEditorController = ['$scope', '$location', '$filter', 'flash', 'eventResource', 'eventTypes',
                                        function($scope, $location, $filter, flash, eventResource, eventTypes) {
        $scope.type = 'event';
        $scope.types = 'events';
        $scope.backPage = 'eventWeeks/current';
        $scope.importStage = 0;
        $scope.contentErrors = [];
        $scope.contentSuccess = [];
        $scope.isValid = false;
        $scope.importErrors = [];
        $scope.importSuccess = [];
        $scope.numSuccess = 0;

        var eventTypeNames = [];
        angular.forEach(eventTypes, function(eventType) { eventTypeNames.push(eventType.name); });

        $scope.eventFormat = [
            { text: "Typ:", value: "eventTypeName", inList: eventTypeNames, description: eventTypeNames.join(', ') },
            { text: "Titel:", value: "title", description: 'Text' },
            { text: "Beskrivning:", value: "description", optional: true, description: 'Radbryt med |.' },
            { text: "Starttid:", value: "startTime", dataType: 'time', description: 'YYYY-MM-DD HH:MM' },
            { text: "Sluttid:", value: "endTime", dataType: 'time', optional: true, description: 'YYYY-MM-DD HH:MM' }
        ];
        
        $scope.prevStage = function() { $scope.importStage = Math.max(0, $scope.importStage - 1); };
        $scope.nextStage = function() { $scope.importStage = Math.min(1, $scope.importStage + 1); };

        $scope.contentChanged = function() {
            if ($scope.importStage == 0) {
                var objects = parseVerticalTextByFormat($scope.content, $scope.eventFormat);
                $scope.contentErrors = objects.errors;
                $scope.contentSuccess = objects.success;
                $scope.numSuccess = objects.success.length;
                $scope.isValid = objects.success.length > 0;
            }
        };

        $scope.import = function() {
            if ($scope.importStage == 1) {
                $scope.importStage = 2;
                importNext(0);
            }
        };

        function importNext(index) {
            if (index >= $scope.contentSuccess.length) {
                // All events have been sent to server. Show result
                $scope.importStage = 3;
                var numSuccess = $scope.importSuccess.length,
                    numErrors = $scope.importErrors.length,
                    numTotals = numSuccess + numErrors;
                
                if (numErrors > 0) {
                    flash.addAlert({
                        type: 'danger',
                        text: $scope.type + 'Import.alert.numItemsFailed',
                        textParams: { count: numErrors, total: numTotals, titles: $scope.importErrors.join(', ') }
                    });
                }
                if (numSuccess > 0) {
                    flash.addAlert({
                        type: 'success',
                        text: $scope.type + 'Import.alert.numItemsImported',
                        textParams: { count: numSuccess, total: numTotals }
                    });
                }
                $location.path('/' + $scope.backPage);
            } else {
                // Get next event to send to server
                var event = $scope.contentSuccess[index];
                var toImport = eventsUtils.createEventFromEventType(getEventTypeByName(event.eventTypeName));
                toImport.title = event.title;
                toImport.description = event.description.replace('|', '\n');
                toImport.startTime = event.startTime + " Europe/Stockholm";
                if (event.endTime) {
                    toImport.endTime = event.endTime + " Europe/Stockholm";
                } else {
                    toImport.endTime = null;
                }

                // Send event to server
                eventResource.getQuery().create(toImport, function (data, headers) {
                    $scope.importSuccess.push(toImport.title);
                    importNext(index + 1);
                }, function(response) {
                    $scope.importErrors.push(toImport.title + ' (' + toImport.startTime + ')');
                    importNext(index + 1);
                });
            }
        }

        function getEventTypeByName(eventTypeName) {
            var foundEventType = null;
            angular.forEach(eventTypes, function(eventType) {
                if (eventType.name == eventTypeName) {
                    foundEventType = eventType;
                }
            });
            return foundEventType;
        }
    }];

    /* Configuration */
    var eventsConfig = ['$routeProvider', function($routeProvider) {
        var eventsPath = 'events';

        var getOneEvent = ['eventResource', function(eventResource) {
            return eventResource.getOne();
        }];
        var getOneEventType = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getOneUseParamAsId('eventTypeId');
        }];
        var getAllEventTypes = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getAll();
        }];
        var getAllLocations = ['locationResource', function(locationResource) {
            return locationResource.getAll();
        }];
        
        var resolveShow = {
            item: getOneEvent
        };
        var resolveEdit = {
            item: getOneEvent,
            eventType: function() { return null; }
        };
        var resolveNew = {
            item: getOneEvent,
            eventType: getOneEventType
        };

        $routeProvider.when('/events/import', {
            templateUrl: 'modules/events/html/eventsImportEditor.html',
            controller:  'eventsImportEditorController',
            resolve:     { eventTypes : getAllEventTypes }
        });

        utils.createBasicOneRoute($routeProvider, eventsPath, resolveShow, resolveEdit, resolveNew);
    }];


    /* Module setup */

    thisModule.config(eventsConfig);
    thisModule.controller('eventController', eventController);
    thisModule.controller('eventEditorController', eventEditorController);
    thisModule.controller('eventsImportEditorController', eventsImportEditorController);

}());
