window.HomeView = Backbone.View.extend({
	template: 'HomeView',

    initialize: function() {
        console.log('Initializing HomeView');
        this.render();
    },
	
    render: function() {
    	window.headerView.updateSelectedSection();
    	
		var that = this;
	    window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);
			var html = template();
			that.$el.html(html);
	    });
		
        return this;
    },
});