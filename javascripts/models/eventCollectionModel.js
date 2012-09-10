window.EventCollection = Backbone.Collection.extend({

    model: Event,
    
    url: "http://localhost:9000/api/v1-snapshot/events?since=1157799600000"
});