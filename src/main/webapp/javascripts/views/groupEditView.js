window.GroupEditView = Backbone.View.extend({
 
	template: 'GroupEditView',
	
	initialize:function() {
		console.log('Initializing GroupEditView');
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
        "change input[type='text']"		: "change",
        "change input[type='password']"	: "change",
		"click .save"					: "save",
		"click .cancel"					: "cancel",
		"click #deleteButton"			: "beforeDelete",
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
				window.headerView.showAlert({type:"alert-success", message:"The group was saved"}, {keepAlert:true});
				app.navigate("groups/" + model.id, {trigger: true});
            },
            error: function (model, response, three) {
				var errors = null;
				try {
					errors = $.parseJSON(response.responseText);						
				} catch (error) {
					errors = [{property:"", message:response.responseText}];
				}
					
                window.headerView.showAlert({type:"alert-error", message:"Couldn't save group", errors:errors});
            }
        });
		return false;
	},
	
	cancel: function() {
	    window.headerView.removeAlert();
		if (this.model.id) {
			app.navigate("groups/" + this.model.id, {trigger: true});			
		} else {
			app.navigate("groups", {trigger: true});	
		}
		return false;
	},

	beforeDelete: function() {
		var confirmed = confirm('Are you sure you want to delete this group?');
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
					window.headerView.showAlert({type:"alert-success", message:"The group was deleted"}, {keepAlert:true});
    				app.navigate("groups", {trigger: true});
                },
                error: function (model, response) {
                    window.headerView.showAlert({type:"alert-error", message:"Couldn't delete group"});
                }
            });   
		} else {
		    window.headerView.removeAlert();
			app.navigate("groups", {trigger: true});
		}
		return false;
	}
});