window.HeaderView = Backbone.View.extend({
	template: 'AlertView',

    initialize: function() {
    	console.log('Initializing AlertView');
    	this.render();
    },

    render: function() {
		var that = this;
	    window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);
			var html = template();
			
			
			that.$el.html(html);
	    });
		
        return this;
    }
});