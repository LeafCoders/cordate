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
			
			that.updateSelectedSection();
	    });
		
        return this;
    },
    
    updateSelectedSection: function() {
    	this.select(window.currentView + "-menu");
    },

    select: function(menuItem) {
    	this.$('.nav li').removeClass('active');
    	this.$('.' + menuItem).addClass('active');
		
		if (!this.keepAlert) {
			this.removeAlert();	
		} else {
			this.keepAlert = false;
		}
    },
    
    showAlert: function(alert, options) {
		if (alert) {
	        var that = this;
	        window.templateManager.get("AlertView", function(templateSource) {
	            var template = Handlebars.compile(templateSource);
				var html = template(alert);
				this.$("#alert").html(html);
	        });
			
			if (options && options['keepAlert']) {
				this.keepAlert = true;
			}
		}
    },
    
    removeAlert: function() {
    	this.$("#alert").html("");
    }
});