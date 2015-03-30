'use strict';

(function () {

    var thisModule = angular.module('rosetteResources', ['ngRoute', 'ngResource']);

    var cordateApiPath = '/cordate/api/v1-snapshot';

    /* Helper methods */

    function BasicQuery($resource, resourceName) {
        return function() {
            return $resource(cordateApiPath + '/' + resourceName + '/:id', { id: '@id' }, {
                create: { method: 'POST', params: { id: null } },
                update: { method: 'PUT' }
            });
        };
    };
    
    // Methods to get promises for one or all items of a resource
    function BasicResource($route, query, newModelFn) {
        var getOne = function(extraQueryParams) {
            var itemId = $route.current.pathParams.id;
            if (itemId == undefined) {
                if (newModelFn != null) {
                    return newModelFn($route.current.params); 
                } else {
                    return {};
                }
            } else {
                var params = angular.extend({ id: itemId }, extraQueryParams);
                return query().get(params).$promise;
            }
        };
        var getOneUseParamAsId = function(paramAsId, extraQueryParams) {
            var itemId = $route.current.params[paramAsId];
            if (itemId == undefined) {
                return {};
            } else {
                var params = angular.extend({ id: itemId }, extraQueryParams);
                return query().get(params).$promise;
            }
        };
        var getAll = function(extraQueryParams) {
            return query().query(extraQueryParams).$promise;
        };

        return {
            getQuery: query,
            getOne: getOne,
            getOneUseParamAsId: getOneUseParamAsId,
            getAll: getAll
        };
    };
    
    function setStartAndEndTimes(model, startParam, startTime, endParam, endTime) {
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        
        model[startParam] = year + '-' + month + '-' + day + ' ' + startTime + ' Europe/Stockholm';
        model[endParam]   = year + '-' + month + '-' + day + ' ' + endTime   + ' Europe/Stockholm';
    };

// http://blog.brunoscopelliti.com/show-route-only-after-all-promises-are-resolved    
    /* Resource methods */

    var bookingResource = ['$route', '$resource', function($route, $resource) {
        return BasicResource($route, BasicQuery($resource, 'bookings'));
    }];

    var eventResource = ['$route', '$http', '$resource', function($route, $http, $resource) {
        var newModelFn = function(params) {
            var newModel = {};
            setStartAndEndTimes(newModel, 'startTime', '11:00', 'endTime', '12:00');
            return newModel;
        };
        var resourceMethods = BasicResource($route, BasicQuery($resource, 'events'), newModelFn);

        resourceMethods.assignResource = function(eventId, resourceTypeId, resourceData) {
            return $http.put(cordateApiPath + '/events/' + eventId + '/resources/' + resourceTypeId, resourceData);
        };

        return resourceMethods;
    }];

    var eventWeekResource = ['$route', '$resource', function($route, $resource) {
        return BasicResource($route, BasicQuery($resource, 'eventWeeks'));
    }];

    var eventTypeResource = ['$route', '$resource', function($route, $resource) {
        return BasicResource($route, BasicQuery($resource, 'eventTypes'));
    }];

    var groupMembershipResource = ['$route', '$resource', function($route, $resource) {
        return BasicResource($route, BasicQuery($resource, 'groupMemberships'));
    }];

    var groupResource = ['$route', '$resource', function($route, $resource) {
        return BasicResource($route, BasicQuery($resource, 'groups'));
    }];

    var locationResource = ['$route', '$resource', function($route, $resource) {
        return BasicResource($route, BasicQuery($resource, 'locations'));
    }];

    var permissionResource = ['$route', '$http', '$resource', function($route, $http, $resource) {
        var resourceMethods = BasicResource($route, BasicQuery($resource, 'permissions'));

        resourceMethods.permissionsForUser = function () {
            return $http.get(cordateApiPath + '/permissionsForUser');
        };

        return resourceMethods; 
    }];

    var posterResource = ['$route', '$resource', function($route, $resource) {
        var newModelFn = function(params) {
            var newModel = {};
            setStartAndEndTimes(newModel, 'startTime', '07:00', 'endTime', '22:00');
            newModel['duration'] = 10;
            return newModel;
        };
        return BasicResource($route, BasicQuery($resource, 'posters'), newModelFn);
    }];

    var uploadResource = ['$route', '$resource', function($route, $resource) {
        var query = function() {
            return $resource(cordateApiPath + '/uploads/:folderId/:id',
                    { folderId: '@folderId', id: '@id' },
                    { create: { method: 'POST' }, update: { method: 'PUT' } });
        };
        return BasicResource($route, query);
    }];

    var uploadFolderResource = ['$route', '$resource', function($route, $resource) {
        return BasicResource($route, BasicQuery($resource, 'uploadFolders'));
    }];

    var resourceTypeResource = ['$route', '$resource', function($route, $resource) {
        var newModelFn = function(params) {
            return { type: params.type };
        };
        return BasicResource($route, BasicQuery($resource, 'resourceTypes'), newModelFn);
    }];

    var signupUserResource = ['$route', '$http', '$resource', function($route, $http, $resource) {
        var resourceMethods = BasicResource($route, BasicQuery($resource, 'signupUsers'));

        resourceMethods.transformToUser = function (signupUserId) {
            return $http.post(cordateApiPath + '/signupUsersTransform/' + signupUserId);
        };

        return resourceMethods; 
    }];

    var userResource = ['$route', '$resource', function($route, $resource) {
        return BasicResource($route, BasicQuery($resource, 'users'));
    }];
    

    /* Resource services */

    thisModule.factory('bookingResource', bookingResource);
    thisModule.factory('eventResource', eventResource);
    thisModule.factory('eventWeekResource', eventWeekResource);
    thisModule.factory('eventTypeResource', eventTypeResource);
    thisModule.factory('groupMembershipResource', groupMembershipResource);
    thisModule.factory('groupResource', groupResource);
    thisModule.factory('locationResource', locationResource);
    thisModule.factory('permissionResource', permissionResource);
    thisModule.factory('posterResource', posterResource);
    thisModule.factory('uploadResource', uploadResource);
    thisModule.factory('uploadFolderResource', uploadFolderResource);
    thisModule.factory('resourceTypeResource', resourceTypeResource);
    thisModule.factory('signupUserResource', signupUserResource);
    thisModule.factory('userResource', userResource);

}());
