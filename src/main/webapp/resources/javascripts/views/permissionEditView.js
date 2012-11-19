window.PermissionEditView = Backbone.View.extend({
 
	template: 'PermissionEditView',
	
	initialize:function() {
		console.log('Initializing PermissionEditView');
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
			
			if (model.patterns) {
				that.$("[name='patterns']").val(model.patterns.join("\n"));
			}
	    });		
		
        return this;
    },
	
    events: {
        "change input[type='text']"		: "change",
        "change input[type='radio']"	: "change",
        "change select"					: "change",
        "change textarea"				: "change",
		"click .save"					: "save",
		"click .cancel"					: "cancel",
		"click #deleteButton"			: "beforeDelete",
    },
	
	change: function (event) {
        // Apply the change to the model
        var target = event.target;
        var change = {};
		
        if (target.name == "patterns") {
        	var patterns = target.value.split(/\n/);
        	change[target.name] = patterns;
        } else if (target.name == "patternType") {
        	if ("everyone" == target.value) {
        		change["groupId"] = null;
        		change["userId"] = null;
        		change["everyone"] = true;
        		
        		this.$("select[name='group']").val(null);
        		this.$("select[name='user']").val(null);
        		
        		this.setGroupSelectionVisibility(false);
        		this.setUserSelectionVisibility(false);
        	} else if ("group" == target.value) {
        		change["groupId"] = null;
        		change["userId"] = null;
        		change["everyone"] = null;
        		
        		this.$("select[name='group']").val(null);
        		this.$("select[name='user']").val(null);
        		
        		this.setGroupSelectionVisibility(true);
        		this.setUserSelectionVisibility(false);
        	} else if ("user" == target.value) {
        		change["groupId"] = null;
        		change["userId"] = null;
        		change["everyone"] = null;
        		
        		this.$("select[name='group']").val(null);
        		this.$("select[name='user']").val(null);
        		
        		this.setGroupSelectionVisibility(false);
        		this.setUserSelectionVisibility(true);
        	}
        } else if (target.name == "group") {
        	change["groupId"] = target.value;
    		change["userId"] = null;
    		change["everyone"] = null;
        } else if (target.name == "user") {
        	change["groupId"] = null;
    		change["userId"] = target.value;
    		change["everyone"] = null;
        } else {
        	change[target.name] = $.trim(target.value);
        }

        this.model.set(change);
    },
    
    setGroupSelectionVisibility : function(visibilty) {
    	if (visibilty) {
    		this.$("#groupSelection").show();
    	} else {
    		this.$("#groupSelection").hide();    		
    	}
    },
    
    setUserSelectionVisibility : function(visibilty) {
    	if (visibilty) {
    		this.$("#userSelection").show();
    	} else {
    		this.$("#userSelection").hide();
    	}
    },
    
    setCorrentUserAndGroupSelectionVisibility : function() {
    	var everyone = this.model.get("everyone");
    	var groupId = this.model.get("groupId");
    	var userId = this.model.get("userId");
    	
    	if (everyone) {
    		this.setGroupSelectionVisibility(false);
    		this.setUserSelectionVisibility(false);
    	} else if (groupId != null) {
    		this.setGroupSelectionVisibility(true);
    		this.setUserSelectionVisibility(false);
    	} else if (userId != null) {
    		this.setGroupSelectionVisibility(false);
    		this.setUserSelectionVisibility(true);
    	}
    },
	
	save: function() {
		this.model.unset("users");
		this.model.unset("groups");
		
		var self = this;
		this.model.save(null, {
            success: function (model, response) {
				window.headerView.showAlert({type:"alert-success", message:"The permission was saved"}, {keepAlert:true});
				app.navigate("permissions/" + model.id, {trigger: true});
            },
            error: function (model, response, three) {
				var errors = null;
				try {
					errors = $.parseJSON(response.responseText);						
				} catch (error) {
					errors = [{property:"", message:response.responseText}];
				}
					
                window.headerView.showAlert({type:"alert-error", message:"Couldn't save permission", errors:errors});
            }
        });
		return false;
	},
	
	cancel: function() {
	    window.headerView.removeAlert();
		if (this.model.id) {
			app.navigate("permissions/" + this.model.id, {trigger: true});			
		} else {
			app.navigate("permissions", {trigger: true});	
		}
		return false;
	},

	beforeDelete: function() {
		var confirmed = confirm('Are you sure you want to delete this permission?');
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
					window.headerView.showAlert({type:"alert-success", message:"The permission was deleted"}, {keepAlert:true});
    				app.navigate("permissions", {trigger: true});
                },
                error: function (model, response) {
                    window.headerView.showAlert({type:"alert-error", message:"Couldn't delete permission"});
                }
            });   
		} else {
		    window.headerView.removeAlert();
			app.navigate("permissions", {trigger: true});
		}
		return false;
	}
});