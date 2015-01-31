'use strict';

(function () {

    var thisModule = angular.module('bookings', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    function BookingBase($scope) {
        $scope.rowClass = function(item) {
            var now = new Date();
            var endTime = stringToTime(item.endTime);
            if (now > endTime) {
                return 'label label-danger';
            }
            var startTime = stringToTime(item.startTime);
            if (now > startTime) {
                return 'label label-success';
            }
            return 'label label-warning';
        };
    };


    /* Controllers */

    var bookingsController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
        angular.extend(this, new BookingBase($scope));
        $scope.tableHeaderUrl = 'modules/bookings/html/bookingsHeader.html';
        $scope.allowImport = true;
    }];

    var bookingController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
        angular.extend(this, new BookingBase($scope));
    }];

    var bookingEditorController = ['$injector', '$scope', '$filter', 'bookingResource', 'item', function($injector, $scope, $filter, bookingResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, bookingResource, item);

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

            if ($scope.formHelper.endTimePartDate == '' && $scope.formHelper.endTimePartTime == '') {
                delete item.endTime;
            } else {
                item.endTime = $scope.formHelper.endTimePartDate + ' ' + $scope.formHelper.endTimePartTime + ' Europe/Stockholm';
            }

            item.duration = $scope.formHelper.duration;
            return item;
        };
    }];

    var bookingsImportEditorController = ['$scope', '$location', '$filter', 'flash', 'bookingResource', 'locations',
                                          function($scope, $location, $filter, flash, bookingResource, locations) {
        $scope.type = 'booking';
        $scope.types = 'bookings'; 
        $scope.backPage = $scope.types;
        $scope.importStage = 0;
        $scope.contentErrors = [];
        $scope.contentSuccess = [];
        $scope.isValid = false;
        $scope.importErrors = [];
        $scope.importSuccess = [];
        $scope.numSuccess = 0;

        $scope.bookingFormat = [
            { text: "Kund:", value: "customerName", description: 'Text' },
            { text: "Kundgrupp:", value: "customerGroup", description: 'Text' },
            { text: "Starttid:", value: "startTime", dataType: 'time', description: 'YYYY-MM-DD HH:MM' },
            { text: "Sluttid:", value: "endTime", dataType: 'time', description: 'YYYY-MM-DD HH:MM' },
            { text: "Lokal:", value: "location", description: 'Text' }
        ];

        $scope.prevStage = function() { $scope.importStage = Math.max(0, $scope.importStage - 1); };
        $scope.nextStage = function() { $scope.importStage = Math.min(1, $scope.importStage + 1); };

        $scope.contentChanged = function() {
            if ($scope.importStage == 0) {
                var objects = parseVerticalTextByFormat($scope.content, $scope.bookingFormat);
                $scope.contentErrors = objects.errors;
                $scope.contentSuccess = combineBookingsWithSameTime(objects.success);
                $scope.numSuccess = objects.success.length;
                $scope.isValid = objects.success.length > 0;
                $scope.customerGroupTypes = getCustomerGroupTypes(objects.success);
            }
        };

        $scope.import = function() {
            if ($scope.importStage == 1) {
                $('#deleteAllModalConfirm').modal();
            }
        };

        $scope.deleteAll = function(confirmed) {
            if (confirmed) {
                bookingResource.getQuery().remove({}, function() {
                    $scope.importStage = 2;
                    importNext(0);
                }, function() {
                    flash.addAlert({type: 'danger', text: $scope.type + 'Import.alert.deleteAllFailed'});
                    flash.showAlerts();
                    flash.clearAlerts();
                });
            } else {
                $scope.importStage = 2;
                importNext(0);
            }
        };

        $scope.ignoreCustomerGroup = function(groupType) {
            $scope.contentSuccess.forEach(function(booking) {
                if (booking.customerGroup == groupType) {
                    booking.ignore = true;
                }
            });
        };
        
        $scope.isIgnore = function(booking) {
            var ignoreLocations = true;
            booking.locations.forEach(function(l) {
                ignoreLocations &= l.ignore;
            });
            return booking.ignore || ignoreLocations;
        };

        var importNext = function(index) {
            if (index >= $scope.contentSuccess.length) {
                // All booking have been sent to server. Show result
                $scope.importStage = 3;
                var numSuccess = $scope.importSuccess.length,
                    numErrors = $scope.importErrors.length,
                    numTotals = numSuccess + numErrors;
                
                if (numErrors > 0) {
                    flash.addAlert({
                        type: 'danger',
                        text: $scope.type + 'Import.alert.numItemsFailed',
                        values: { count: numErrors, total: numTotals, customers: $scope.importErrors.join(', ') }
                    });
                }
                if (numSuccess > 0) {
                    flash.addAlert({
                        type: 'success',
                        text: $scope.type + 'Import.alert.numItemsImported',
                        values: { count: numSuccess, total: numTotals }
                    });
                }
                $location.path('/' + $scope.backPage);
            } else {
                // Get next booking to send to server
                var booking = $scope.contentSuccess[index];
                if ($scope.isIgnore(booking)) {
                    importNext(index + 1);
                } else {
                    var toImport = { customerName: booking.customerName };
                    toImport.startTime = booking.startTime + " Europe/Stockholm";
                    toImport.endTime = booking.endTime + " Europe/Stockholm";
                    toImport.location = nextLocation(booking);

                    // Send booking to server
                    bookingResource.getQuery().save(toImport, function (data, headers) {
                        $scope.importSuccess.push(toImport.customerName);
                        importNext(index);
                    }, function(response) {
                        $scope.importErrors.push(toImport.customerName + ' (' + toImport.startTime + ')');
                        importNext(index);
                    });
                }
            }
        };

        // Find location item from text. Otherwise use text as location.
        var nextLocation = function(booking) {
            var location = booking.locations.shift();
            while (location.ignore) { location = booking.locations.shift(); }
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].name == location.name) {
                    return { 'ref' : { 'id' : locations[i].id } };
                }
            }
            return { 'text': location.name };
        };
        
        var combineBookingsWithSameTime = function(bookings) {
            var combined = [];

            var combine = function(b) {
                if (combined.every(function(c) {
                    if ((c.startTime    === b.startTime) &&
                        (c.endTime      === b.endTime) &&
                        (c.customerName === b.customerName)) {
                        c.locations.push({name: b.location, ignore: false});
                        return false;
                    }
                    return true;
                })) {
                    b.locations = [{name: b.location, ignore: false}];
                    combined.push(b);
                }
            };

            bookings.forEach(function(booking) {
                combine(booking);
            });
            return combined;
        };
        
        var getCustomerGroupTypes = function(bookings) {
            var types = [];
            bookings.forEach(function(b) {
                if (types.indexOf(b.customerGroup) < 0) {
                    types.push(b.customerGroup);
                }
            });
            return types;
        };
    }];


    /* Configuration */
    var bookingsConfig = ['$routeProvider', function($routeProvider) {
        var bookingsPath = 'bookings';

        var getAllBookings = ['bookingResource', function(bookingResource) {
            return bookingResource.getAll();
        }];
        var getOneBooking = ['bookingResource', function(bookingResource) {
            return bookingResource.getOne();
        }];
        var getAllLocations = ['locationResource', function(locationResource) {
            return locationResource.getAll();
        }];

        utils.createBasicAllRoute($routeProvider, bookingsPath, { items: getAllBookings });

        $routeProvider.when('/bookings/import', {
            templateUrl: 'modules/bookings/html/bookingsImportEditor.html',
            controller:  'bookingsImportEditorController',
            resolve:     { locations : getAllLocations }
        });

        utils.createBasicOneRoute($routeProvider, bookingsPath, { item: getOneBooking });
    }];


    /* Module setup */

    thisModule.config(bookingsConfig);
    thisModule.controller('bookingsController', bookingsController);
    thisModule.controller('bookingController', bookingController);
    thisModule.controller('bookingEditorController', bookingEditorController);
    thisModule.controller('bookingsImportEditorController', bookingsImportEditorController);

}());
