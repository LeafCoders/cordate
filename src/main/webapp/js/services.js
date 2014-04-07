'use strict';

/* Services */

angular.module('myApp.services', ['myApp.translation_sv_SE'])
    .factory('currentItemType', [ '$location', function (location) {
        return function () {
            var pattern = /\/\w+/;
            var matches = pattern.exec(location.$$path);
            var currentType = matches[0].substring(1, matches[0].length - 1);
            return currentType;
        };
    }])
    .value('basePath', '/cordate/api/v1-snapshot')
    .factory('eventWeekResource', function ($resource, basePath) {
        return $resource(basePath + '/eventWeeks/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('eventResource', function ($resource, basePath) {
        return $resource(basePath + '/events/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('userResource', function ($resource, basePath) {
        return $resource(basePath + '/users/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('groupResource', function ($resource, basePath) {
        return $resource(basePath + '/groups/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('groupMembershipResource', function ($resource, basePath) {
        return $resource(basePath + '/groupMemberships/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('groupMembershipResource', function ($resource, basePath) {
        return $resource(basePath + '/groupMemberships?groupId=:groupId', {}, {
            findByGroupId: {
                method: 'GET',
                params: {
                    groupId:'@groupId'
                },
                isArray: true
            }
        });
    })
    .factory('permissionResource', function ($resource, basePath) {
        return $resource(basePath + '/permissions/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('posterResource', function ($resource, basePath) {
            return $resource(basePath + '/posters/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('bookingResource', function ($resource, basePath) {
            return $resource(basePath + '/bookings/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('locationResource', function ($resource, basePath) {
        return $resource(basePath + '/locations/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('uploadResource', function ($resource, basePath) {
        return $resource(basePath + '/uploads/:folderName/:id', {folderName:'@folderName', id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('uploadFolder', function ($resource, basePath) {
        return {
            resource: $resource(basePath + '/uploadFolders/:id', {id:'@id'}, {update:{method:'PUT'}}),
            currentFolder: null
        }
    })
    .factory('userResourceTypeResource', function ($resource, basePath) {
        return $resource(basePath + '/userResourceTypes/:id', {id:'@id'}, {update:{method:'PUT'}});
    })
    .factory('eventTypeResource', function ($resource, basePath) {
        return $resource(basePath + '/eventTypes/:id', {id:'@id'}, {update:{method:'PUT'}});
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