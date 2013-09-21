'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['myApp.translation_sv_SE'])
    .factory('currentType', [ '$location', function (location) {
        return function () {
            var pattern = /\/\w+/;
            var matches = pattern.exec(location.$$path);
            var currentType = matches[0].substring(1, matches[0].length - 1);
            return currentType;
        };
    }])
    .value('basePath', '/cordate/api/v1-snapshot')
    .factory('EventweekResource', function ($resource, basePath) {
        return $resource(basePath + '/eventweeks/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('EventResource', function ($resource, basePath) {
        return $resource(basePath + '/events/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('UserResource', function ($resource, basePath) {
        return $resource(basePath + '/users/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('GroupResource', function ($resource, basePath) {
        return $resource(basePath + '/groups/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('GroupMembershipResource', function ($resource, basePath) {
        return $resource(basePath + '/groupMemberships/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('PermissionResource', function ($resource, basePath) {
        return $resource(basePath + '/permissions/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('PosterResource', function ($resource, basePath) {
            return $resource(basePath + '/posters/:id', {id:'@id'}, {update:{method:'PUT'}});
        })
    .factory("flash", function ($rootScope) {
        var alerts = [];

        $rootScope.$on('$routeChangeSuccess', function () {
            if (alerts) {
                showAlerts();
                clearAlerts();
            } else {
                hideAlerts();
            }
        });

        var addAlert = function(alert) {
            alerts.push(alert);
        }

        var clearAlerts = function() {
            alerts = [];
        }

        var hideAlerts = function() {
            $rootScope.alerts = [];
        }

        var showAlerts = function() {
            $rootScope.alerts = alerts;
            window.scrollTo(0, 0);
        }

        return {
            addAlert: addAlert,
            clearAlerts: clearAlerts,
            showAlerts: showAlerts
        }
    })
    .factory('myHttpInterceptor', function ($q, flash) {
        return {
            response: function (response) {
                if (response.headers()['x-cordate-login']) {
                    window.location.reload();
                    return null;
                }

                return response;
            },
            responseError: function (response) {
                flash.clearAlerts();

                if (response.status == 400) {
                    flash.addAlert({ type: 'danger', text: 'error.badRequest'});
                    flash.showAlerts();
                    flash.clearAlerts();
                } else if (response.status == 403) {
                    flash.addAlert({ type: 'danger', text: 'error.permissionDenied'});
                    flash.showAlerts();
                    flash.clearAlerts();
                } else {
                    flash.addAlert({ type: 'danger', text: 'error.unknownError'});
                    flash.showAlerts();
                    flash.clearAlerts();
                }

                return $q.reject(response);
            }
        };
    });