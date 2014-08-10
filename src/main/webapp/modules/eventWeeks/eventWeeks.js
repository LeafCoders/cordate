'use strict';

(function () {

    var thisModule = angular.module('eventWeeks', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var eventWeekController = ['$injector', '$scope', '$filter', '$route', 'item',
                               function($injector, $scope, $filter, $route, item) {
        utils.extendItemController(this, $injector, $scope, item);

        $scope.type = 'event';
        $scope.backPage = "eventWeeks/current";
        $scope.item = item;

        $scope.remove = function(item) {
            var confirmed = confirm($filter('t')('eventItems.prompt.itemDeleteConfirmation'));
            if (confirmed) {
                eventResource.getQuery().remove({ id : item.id }, function(response, headers) {
                    flash.addAlert({ type: 'success', text: 'eventItems.alert.itemWasDeleted' });
                    $route.reload();
                });
            }
        };
    }];


    /* Configuration */

    var eventWeeksConfig = ['$routeProvider', function($routeProvider) {
        var eventWeeksPath = 'eventWeeks';

        var getOneWeek = ['$q', '$route', 'eventWeekResource', function($q, $route, eventWeekResource) {
            var deferred = $q.defer();

            var id = $route.current.pathParams.id;
            if ($route.current.pathParams.id == undefined) {
                id = "current";
            }
            var item = eventWeekResource.getQuery().get({ id: id }, function(data, headers) {
                var linkHeader = headers().link;
                if (linkHeader.length == 0) {
                    throw new Error("input must not be of zero length");
                }
                // Split parts by comma
                var parts = linkHeader.split(',');
                var links = {};
                // Parse each part into a named link
                angular.forEach(parts, function (p) {
                    var section = p.split(';');
                    if (section.length != 2) {
                        throw new Error("section could not be split on ';'");
                    }
                    var url = section[0].replace(/<(.*)>/, '$1').trim();
                    var name = section[1].replace(/rel="(.*)"/, '$1').trim();
                    links[name] = url;
                });
                item.next_page = '/' + links['next'];
                item.previous_page = '/' + links['previous'];

                deferred.resolve(item);
            });
            return deferred.promise;
        }];
        
        $routeProvider.when('/eventWeeks/current', {
            templateUrl: 'modules/eventWeeks/html/eventWeek.html',
            controller:  'eventWeekController',
            resolve:     { item: getOneWeek }
        });
        $routeProvider.when('/eventWeeks/:id', {
            templateUrl: 'modules/eventWeeks/html/eventWeek.html',
            controller:  'eventWeekController',
            resolve:     { item: getOneWeek }
        });
    }];


    /* Module setup */

    thisModule.config(eventWeeksConfig);
    thisModule.controller('eventWeekController', eventWeekController);

}());