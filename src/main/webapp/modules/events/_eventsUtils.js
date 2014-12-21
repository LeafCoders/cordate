'use strict';

var eventsUtils = eventsUtils || {};

eventsUtils.createEventFromEventType = function (eventType) {
    var event = {
            title: eventType.name,
            description: null,
            eventType: { idRef: eventType.id, referredObject: eventType },
            startTime: '2014-01-01 11:00 Europe/Stockholm',
            endTime: '2014-01-01 12:00 Europe/Stockholm',
            location: null,
            showOnPalmate: eventType.showOnPalmate,
            resources: []
    };
    
    angular.forEach(eventType.resourceTypes, function (resourceTypeRef) {
        var resourceType = resourceTypeRef.referredObject;
        switch (resourceType.type) {
            case 'user':
                event.resources.push(eventsUtils.createResourceTypeUser(resourceType));
                break;
            case 'upload':
                event.resources.push(eventsUtils.createResourceTypeUpload(resourceType));
                break;
        }
    });
    
    return event;
};

eventsUtils.createResourceTypeUser = function (resourceType) {
    return {
        type: 'user',
        resourceType: { idRef: resourceType.id, referredObject: resourceType },
        users: null
    };
};
    
eventsUtils.createResourceTypeUpload = function (resourceType) {
    return {
        type: 'upload',
        resourceType: { idRef: resourceType.id, referredObject: resourceType },
        uploads: null
    };
};
