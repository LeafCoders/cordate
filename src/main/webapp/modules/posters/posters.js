'use strict';

(function () {

    var thisModule = angular.module('posters', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    function PosterBase($scope) {
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

    var postersController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
        angular.extend(this, new PosterBase($scope));
        $scope.tableHeaderUrl = 'modules/posters/html/postersHeader.html';
    }];

    var posterController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
        angular.extend(this, new PosterBase($scope));
    }];

    var posterEditorController = ['$injector', '$scope', '$filter', 'posterResource', 'item', function($injector, $scope, $filter, posterResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, posterResource, item);
        angular.extend(this, new PosterBase($scope));

        var times = [{text: '', value: ''}];
        for (var i = 0; i < 24; i++) {
            var hour = i < 10 ? '0' + i : '' + i;
            times.push({ text: hour + ':00', value: hour + ':00' });
            times.push({ text: hour + ':30', value: hour + ':30' });
        }

        $scope.formHelper = {
            startTimePartDate: $filter('date')(item.startTime),
            startTimePartTime: $filter('time')(item.startTime),
            endTimePartDate: $filter('date')(item.endTime),
            endTimePartTime: $filter('time')(item.endTime),
            duration: item.duration,
            times: times,
            durations: [{ text: '10 s', value: 10}, { text: '15 s', value: 15 }]
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


    /* Configuration */
    var postersConfig = ['$routeProvider', function($routeProvider) {
        var postersPath = 'posters';

        var getAllPosters = ['posterResource', function(posterResource) {
            return posterResource.getAll();
        }];
        var getOnePoster = ['posterResource', function(posterResource) {
            return posterResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, postersPath, { items: getAllPosters });
        utils.createBasicOneRoute($routeProvider, postersPath, { item: getOnePoster });
    }];


    /* Module setup */

    thisModule.config(postersConfig);
    thisModule.controller('postersController', postersController);
    thisModule.controller('posterController', posterController);
    thisModule.controller('posterEditorController', posterEditorController);

}());
