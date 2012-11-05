window.GroupCollection = Backbone.Collection.extend({

    model: Group,
    
    url: "api/v1-snapshot/groups"
});