'use strict';

(function () {

    var thisModule = angular.module('groupMemberships', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var groupMembershipsController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var groupMembershipController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var groupMembershipEditorController = ['$injector', '$scope', 'groupMembershipResource', 'item', 'users', 'groups',
                                           function($injector, $scope, groupMembershipResource, item, users, groups) {
        utils.extendItemEditorController(this, $injector, $scope, groupMembershipResource, item);
        $scope.users = users;
        $scope.groups = groups;
    }];


    /* Configuration */
    var groupMembershipsConfig = ['$routeProvider', function($routeProvider) {
        var groupMembershipsPath = 'groupMemberships';

        var getAllGroupMemberships = ['groupMembershipResource', function(groupMembershipResource) {
            return groupMembershipResource.getAll();
        }];
        var getOneGroupMembership = ['groupMembershipResource', function(groupMembershipResource) {
            return groupMembershipResource.getOne();
        }];
        var getAllUsers = ['userResource', function(userResource) {
            return userResource.getAll();
        }];
        var getAllGroups = ['groupResource', function(groupResource) {
            return groupResource.getAll();
        }];

        utils.createBasicAllRoute($routeProvider, groupMembershipsPath, { items: getAllGroupMemberships });
        utils.createBasicOneRoute($routeProvider, groupMembershipsPath,
                { item: getOneGroupMembership },
                { item: getOneGroupMembership, users: getAllUsers, groups: getAllGroups });
    }];


    /* Module setup */

    thisModule.config(groupMembershipsConfig);
    thisModule.controller('groupMembershipsController', groupMembershipsController);
    thisModule.controller('groupMembershipController', groupMembershipController);
    thisModule.controller('groupMembershipEditorController', groupMembershipEditorController);

}());
