window.EventCollectionView = Backbone.View.extend({

    tagName: 'table',
	
	className : 'table',

    initialize:function () {
        this.model.bind("reset", this.render, this);
    },
    
    render:function (eventName) {
        _.each(this.model.models, function (event) {
            $(this.el).append(new EventView({model:event}).render().el);
        }, this);
        return this;
    }

});