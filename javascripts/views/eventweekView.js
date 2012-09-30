window.EventweekView = Backbone.View.extend({
 
	template: 'EventweekView',
	
	initialize:function() {
		console.log('Initializing EventweekView');
		this.render();
	},
    
    render:function(eventName) {		
		var that = this;
	    window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);
			
			var model = that.model.toJSON();			
			var html = template(model);
			
			that.$el.html(html);
	    });
		
        return this;
    }
});
