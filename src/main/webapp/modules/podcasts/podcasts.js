'use strict';

(function (window) {

    var thisModule = angular.module('podcasts', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var rosetteApiPath = window.rosetteBaseUrl + '/api/v1';

    /* Controllers */

    var podcastsController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var podcastController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);

        $scope.podcastUrl = rosetteApiPath + '/public/podcasts/' + item.id;
    }];

    var podcastEditorController = ['$injector', '$scope', 'podcastResource', 'item',
                                     function($injector, $scope, podcastResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, podcastResource, item);
    }];

    /* Configuration */
    var podcastsConfig = ['$routeProvider', function($routeProvider) {
        var podcastsPath = 'podcasts';

        var getAllPodcasts = ['podcastResource', function(podcastResource) {
            return podcastResource.getAll();
        }];
        var getOnePodcast = ['podcastResource', function(podcastResource) {
            return podcastResource.getOne();
        }];

        utils.createBasicAllRoute($routeProvider, podcastsPath, { items: getAllPodcasts });
        utils.createBasicOneRoute($routeProvider, podcastsPath, {
            item: getOnePodcast
        });
    }];


    /* Module setup */

    thisModule.config(podcastsConfig);
    thisModule.controller('podcastsController', podcastsController);
    thisModule.controller('podcastController', podcastController);
    thisModule.controller('podcastEditorController', podcastEditorController);

}(window));
