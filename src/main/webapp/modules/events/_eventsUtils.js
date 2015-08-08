'use strict';

var eventsUtils = eventsUtils || {};

eventsUtils.createEventFromEventType = function (eventType) {
    var event = {
            title: eventType.name,
            description: null,
            eventType: eventType,
            startTime: '2014-01-01 11:00 Europe/Stockholm',
            endTime: '2014-01-01 12:00 Europe/Stockholm',
            location: null,
            isPublic: eventType.hasPublicEvents.value,
            resources: []
    };
    
    angular.forEach(eventType.resourceTypes, function (resourceTypeRef) {
        event.resources.push(eventsUtils.createResource(resourceTypeRef.type, resourceTypeRef));
    });
    
    return event;
};

eventsUtils.createResource = function (type, resourceType) {
    switch (type) {
        case 'user':
            return eventsUtils.createResourceTypeUser(resourceType);
        case 'upload':
            return eventsUtils.createResourceTypeUpload(resourceType);
    }
};

eventsUtils.createResourceTypeUser = function (resourceType) {
    return {
        type: 'user',
        resourceType: resourceType,
        users: { "refs" : [] }
    };
};
    
eventsUtils.createResourceTypeUpload = function (resourceType) {
    return {
        type: 'upload',
        resourceType: resourceType,
        uploads: []
    };
};
