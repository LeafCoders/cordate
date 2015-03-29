'use strict';

(function () {

    var thisModule = angular.module('groupMemberships', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    var lastSortOrder = null;
    
    /* Controllers */

    var groupMembershipsController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);

        $scope.sortOrders = [
            { text: 'formLabel.group', orderBy: ['group.name', 'user.fullName'] },
            { text: 'formLabel.user', orderBy: ['user.fullName', 'group.name'] }
        ];
        
        $scope.setSortOrder = function(sortOrder) {
            $scope.currentSortOrder = sortOrder;
            lastSortOrder = sortOrder;
        };

        $scope.setSortOrder(lastSortOrder || $scope.sortOrders[0]);
    }];

    var groupMembershipController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var groupMembershipEditorController = ['$injector', '$scope', 'groupMembershipResource', 'item',
                                           function($injector, $scope, groupMembershipResource, item) {
        utils.extendItemEditorController(this, $injector, $scope, groupMembershipResource, item);
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

        utils.createBasicAllRoute($routeProvider, groupMembershipsPath, { items: getAllGroupMemberships });
        utils.createBasicOneRoute($routeProvider, groupMembershipsPath, { item: getOneGroupMembership } );
    }];


    /* Module setup */

    thisModule.config(groupMembershipsConfig);
    thisModule.controller('groupMembershipsController', groupMembershipsController);
    thisModule.controller('groupMembershipController', groupMembershipController);
    thisModule.controller('groupMembershipEditorController', groupMembershipEditorController);

}());
