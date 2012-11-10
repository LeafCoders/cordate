window.ThemeEditView = Backbone.View.extend({
 
	template: 'ThemeEditView',
	
	initialize:function() {
		console.log('Initializing ThemeEditView');
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
    },
	
    events: {
        "change input[type='text']"	: "change",
        "change textarea"			: "change",
		"click .save"				: "save",
		"click .cancel"				: "cancel",
		"click #deleteButton"		: "beforeDelete",
    },
	
	change: function (event) {
        // Apply the change to the model
        var target = event.target;
        var change = {};
		
		change[target.name] = $.trim(target.value);

        this.model.set(change);
    },
	
	save: function() {
		var self = this;
		this.model.save(null, {
            success: function (model, response) {
				window.headerView.showAlert({type:"alert-success", message:"The theme was saved"}, {keepAlert:true});
				app.navigate("themes/" + model.id, {trigger: true});
            },
            error: function (model, response, three) {
				var errors = null;
				try {
					errors = $.parseJSON(response.responseText);						
				} catch (error) {
					errors = [{property:"", message:response.responseText}];
				}
					
                window.headerView.showAlert({type:"alert-error", message:"Couldn't save theme", errors:errors});
            }
        });
		return false;
	},
	
	cancel: function() {
	    window.headerView.removeAlert();
		if (this.model.id) {
			app.navigate("themes/" + this.model.id, {trigger: true});			
		} else {
			app.navigate("themes", {trigger: true});	
		}
		return false;
	},

	beforeDelete: function() {
		var confirmed = confirm('Are you sure you want to delete this theme?');
		if (confirmed) {
			this.doDelete();
		}
		return false;
	},
	
	doDelete: function() {
		var self = this;
		
		if (this.model.id) {
    		this.model.destroy({
                success: function (model, response) {
					window.headerView.showAlert({type:"alert-success", message:"The theme was deleted"}, {keepAlert:true});
    				app.navigate("themes", {trigger: true});
                },
                error: function (model, response) {
                    window.headerView.showAlert({type:"alert-error", message:"Couldn't delete theme"});
                }
            });   
		} else {
		    window.headerView.removeAlert();
			app.navigate("themes", {trigger: true});
		}
		return false;
	}
});