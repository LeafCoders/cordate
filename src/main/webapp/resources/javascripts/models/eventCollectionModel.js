window.EventCollection = Backbone.Collection.extend({

    model: Event,
    
    url: "api/v1-snapshot/events?since=1157799600000"
});