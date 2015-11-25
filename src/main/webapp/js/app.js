'use strict';


(function () {

    var dependencies = ['ngResource', 'ngRoute', 'ngAnimate', 'ngSanitize',
                        'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.modal', 'mgcrea.ngStrap.datepicker', 'mgcrea.ngStrap.timepicker',
                        'myApp.translation_sv_SE',
                        'bookings',
                        'educationThemes', 'educationTypes', 'educations',
                        'events', 'eventTypes', 'eventWeeks', 'eventSemesters',
                        'groups', 'groupMemberships', 'locations', 'permissions', 'posters',
                        'uploadFolders', 'uploads', 'users', 'signupUsers', 'resourceTypes'
                        ];

    var app = angular.module('myApp', dependencies);


    var mainController = ['$scope', 'flash', 'permissionService', function($scope, flash, permissionService) {
        $scope.hasLoadedApp = false;

        $scope.closeAlert = function(index) {
            flash.clearAlerts();
        };

        permissionService.init(function (resultStatus) {
            $scope.hasLoadedApp = resultStatus;
        });
    }];


    var flashFactory = ['$rootScope', function($rootScope) {
        var alerts = [];

        $rootScope.$on('$routeChangeSuccess', function() {
            if (alerts) {
                showAlerts();
                clearAlerts();
            } else {
                hideAlerts();
            }
        });

        var addAlert = function(alert) {
            alerts.push(alert);
        };

        var clearAlerts = function() {
            alerts = [];
        };

        var hideAlerts = function() {
            $rootScope.alerts = [];
        };

        var showAlerts = function() {
            $rootScope.alerts = alerts;
            window.scrollTo(0, 0);
        };

        return {
            addAlert: addAlert,
            clearAlerts: clearAlerts,
            showAlerts: showAlerts
        };
    }];


    var httpInterceptor = ['$q', 'flash', function($q, flash) {
        var jwtToken = undefined;
        return {
            request: function(config) {
                if (jwtToken) {
                    config.headers['x-auth-token'] = jwtToken;
                }
                return config;
            },
            response: function(response) {
                if (response.headers()['x-auth-token']) {
                    jwtToken = response.headers()['x-auth-token'];
                }
                
                if (response.headers()['x-cordate-login']) {
                    window.location.reload();
                    return null;
                }

                return response;
            },
            responseError: function(response) {
                var alertMessage = {
                        type: 'danger',
                        header: response.data.error,
                        text: response.data.reason
                };
                if (response.data.reasonParams) {
                    alertMessage.textParams = {};
                    response.data.reasonParams.every(function(text, index) {
                        alertMessage.textParams["P" + index] = text;
                    });
                }
                
                if (response.status != 400 && response.status != 403) {
                    alertMessage.header = 'error.unknownError';
                }

                flash.clearAlerts();
                flash.addAlert(alertMessage);
                flash.showAlerts();
                flash.clearAlerts();

                return $q.reject(response);
            }
        };
    }];

    /* Module setup */

    app.config(function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('cordateHttpInterceptor');
    });

    app.controller('MainController', mainController);

    app.factory('cordateHttpInterceptor', httpInterceptor);       
    app.factory('flash', flashFactory);

    app.value('$anchorScroll', angular.noop);

}());
