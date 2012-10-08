window.ThemeCollection = Backbone.Collection.extend({

    model: Theme,
    
    url: "api/v1-snapshot/themes"
});