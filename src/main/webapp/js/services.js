'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1').
    factory('currentType', [ '$location', function (location) {
    return function () {
        var pattern = /\/\w+/;
        var matches = pattern.exec(location.$$path);
        var currentType = matches[0].substring(1, matches[0].length - 1);
        return currentType;
    };
}]).
    factory('currentResource', [ '$resource', 'currentType', function (resource, currentType) {
    return resource('/cordate/api/v1-snapshot/:collection/:id', {collection:currentType(), id:'@id'}, {update:{method:'PUT'}});
} ]).
    factory('rosetteResource', [ '$resource', function (resource) {
    return function(collection) {
        return resource('/cordate/api/v1-snapshot/:collection/:id', {collection:collection, id:'@id'}, {update:{method:'PUT'}});
    }
    }]).
    factory('rosetteResource2', [ '$resource', function (resource) {
    return function(path) {
        return resource('/cordate/api/v1-snapshot/' + path, {}, {update:{method:'PUT'}});
    }
}]).
    factory("flash", function ($rootScope) {
        var alert;

        $rootScope.$on('$routeChangeSuccess', function () {
            if (alert) {
                showAlert(alert);
            } else {
                $rootScope.alerts = [];
            }
        });

        var showAlert = function(newAlert) {
            $rootScope.alerts = [
                { type:newAlert.type, text:newAlert.text }
            ];
            alert = null;
        }

        var showAlertAfterRedirect = function(newAlert) {
            alert = newAlert;
        }

        var removeAlert = function() {
            alert = null;
            $rootScope.alerts = [];
        }

        return {
            showAlert: showAlert,
            showAlertAfterRedirect: showAlertAfterRedirect,
            removeAlert: removeAlert
        }
    });