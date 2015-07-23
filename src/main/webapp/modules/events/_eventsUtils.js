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
            showOnPalmate: eventType.showOnPalmate,
            resources: []
    };
    
    angular.forEach(eventType.resourceTypes, function (resourceTypeRef) {
        switch (resourceTypeRef.type) {
            case 'user':
                event.resources.push(eventsUtils.createResourceTypeUser(resourceTypeRef));
                break;
            case 'upload':
                event.resources.push(eventsUtils.createResourceTypeUpload(resourceTypeRef));
                break;
        }
    });
    
    return event;
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
