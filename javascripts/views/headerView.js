window.HeaderView = Backbone.View.extend({
	template: 'HeaderView',

    initialize: function() {
    	console.log('Initializing HeaderView');
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
    },

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    },
    
    showAlert: function(alert) {
        var that = this;
        window.templateManager.get("AlertView", function(templateSource) {
            var template = Handlebars.compile(templateSource);
			var html = template(alert);
			this.$("#alert").html(html);
        });
    },
    
    removeAlert: function() {
        this.$("#alert").html("");
    }
});