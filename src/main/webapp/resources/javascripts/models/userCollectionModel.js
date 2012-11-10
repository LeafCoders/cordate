window.UserCollection = Backbone.Collection.extend({

    model: User,
    
    url: "api/v1-snapshot/users"
});