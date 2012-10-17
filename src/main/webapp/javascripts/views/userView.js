window.UserView = Backbone.View.extend({
 
	template: 'UserView',
	
	initialize:function() {
		console.log('Initializing UserView');
		this.render();
	},
    
    render:function(eventName) {
    	window.headerView.updateSelectedSection();
    	
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