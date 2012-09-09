window.EventView = Backbone.View.extend({
 
    tagName: "tr", 
 
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
 
});