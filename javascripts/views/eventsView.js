window.EventsView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Events View');
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});