window.PermissionCollection = Backbone.Collection.extend({

    model: Permission,
    
    url: "api/v1-snapshot/permissions"
});