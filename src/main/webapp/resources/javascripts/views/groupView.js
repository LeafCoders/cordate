window.GroupView = Backbone.View.extend({
 
	template: 'GroupView',
	
	initialize:function() {
		console.log('Initializing GroupView');
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