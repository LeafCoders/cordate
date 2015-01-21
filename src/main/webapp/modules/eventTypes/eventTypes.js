'use strict';

(function () {

    var thisModule = angular.module('eventTypes', ['ngRoute', 'ngResource', 'rosetteResources', 'baseUI']);

    /* Controllers */

    var eventTypesController = ['$injector', '$scope', 'items', function($injector, $scope, items) {
        utils.extendItemsController(this, $injector, $scope, items);
    }];

    var eventTypeController = ['$injector', '$scope', 'item', function($injector, $scope, item) {
        utils.extendItemController(this, $injector, $scope, item);
    }];

    var eventTypeEditorController = ['$injector', '$scope', 'eventTypeResource', 'item', 'resourceTypes',
                                     function($injector, $scope, eventTypeResource, item, resourceTypes) {
        utils.extendItemEditorController(this, $injector, $scope, eventTypeResource, item);

        // Filter used resource types from all available
        $scope.availableResourceTypes = resourceTypes.filter(function(allResourceType) {
            var found = false;
            if (item.resourceTypes) {
                item.resourceTypes.some(function(resourceType) {
                    if (allResourceType.id == resourceType.id) {
                        found = true;
                    }
                    return found;
                });
            }
            return !found;
        });

        $scope.sections = resourceTypesToSections(item.resourceTypes);

        $scope.beforeSave = function(item) {
            item.resourceTypes = sectionsToResourceTypes($scope.sections); 
            return item;
        };
        
        $scope.addResourceType = function(resourceType) {
            addResourceTypeToSections(resourceType, $scope.sections);
            var index = $scope.availableResourceTypes.indexOf(resourceType);
            if (index > -1) {
                $scope.availableResourceTypes.splice(index, 1);
            }
        };
        
        $scope.removeResourceType = function(resourceType) {
            removeResourceTypeFromSections(resourceType, $scope.sections);
            $scope.availableResourceTypes.push(resourceType);
        };
        
        $scope.moveResourceType = function(resourceType, direction) {
            var section = findSectionOfResourceType($scope.sections, resourceType);
            if (section) {
                var index1 = section.resourceTypes.indexOf(resourceType);
                var index2 = index1 + direction;
                if (index2 >= 0 && index2 < section.resourceTypes.length) {
                    var temp = section.resourceTypes[index1];
                    section.resourceTypes[index1] = section.resourceTypes[index2];
                    section.resourceTypes[index2] = temp;
                }
            }
        };
    }];

    var resourceTypesToSections = function(resourceTypeRefs) {
        var sections = [];
        if (resourceTypeRefs) {
            resourceTypeRefs.forEach(function(rtRef) {
                addResourceTypeToSections(rtRef, sections);
            });
        }
        return sections;
    }; 

    var addResourceTypeToSections = function(resourceType, sections) {
        var section = findSectionOfResourceType(sections, resourceType);
        if (section) {
            section.resourceTypes.push(resourceType);
        } else {
            sections.push({ sectionName: resourceType.section, resourceTypes: [resourceType] });
        }
    };
    
    var removeResourceTypeFromSections = function(resourceType, sections) {
        var section = findSectionOfResourceType(sections, resourceType);
        if (section) {
            var index = section.resourceTypes.indexOf(resourceType);
            if (index > -1) {
                section.resourceTypes.splice(index, 1);
                // TODO: Remove section if empty
            }
        } 
    };
    
    var findSectionOfResourceType = function(sections, resourceType) {
        var foundSection = null;
        sections.some(function(section) {
            if (section.sectionName == resourceType.section) {
                foundSection = section;
                return true;
            }
            return false;
        });
        return foundSection;
    };
    
    var sectionsToResourceTypes = function(sections) {
        var refs = [];
        sections.forEach(function(section) {
            section.resourceTypes.forEach(function(resourceType) {
                refs.push(resourceType);
            });
        });
        return refs;
    };
    
    /* Configuration */
    var eventTypesConfig = ['$routeProvider', function($routeProvider) {
        var eventTypesPath = 'eventTypes';

        var getAllEventTypes = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getAll();
        }];
        var getOneEventType = ['eventTypeResource', function(eventTypeResource) {
            return eventTypeResource.getOne();
        }];
        var getAllResourceTypes = ['resourceTypeResource', function(resourceTypeResource) {
            return resourceTypeResource.getAll();
        }];

        utils.createBasicAllRoute($routeProvider, eventTypesPath, { items: getAllEventTypes });
        utils.createBasicOneRoute($routeProvider, eventTypesPath, {
            item: getOneEventType,
            resourceTypes: getAllResourceTypes
        });
    }];


    /* Module setup */

    thisModule.config(eventTypesConfig);
    thisModule.controller('eventTypesController', eventTypesController);
    thisModule.controller('eventTypeController', eventTypeController);
    thisModule.controller('eventTypeEditorController', eventTypeEditorController);

}());
