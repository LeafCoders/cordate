window.EventEditView = Backbone.View.extend({
 
	template: 'EventEditView',
	
	initialize:function() {
		console.log('Initializing EventEditView');
		this.render();
	},
	
    render:function(eventName) {		
		var that = this;
	    window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);
			
			var model = that.model.toJSON();			
			var html = template(model);
			
			that.$el.html(html);
			
			that.$("[name='startDate']").datepicker({format:'yyyy-mm-dd', weekStart:1, autoclose:true, todayHighlight:true});
			that.$("[name='startTime']").timePicker();
			
			that.$("[name='endDate']").datepicker({format:'yyyy-mm-dd', weekStart:1, autoclose:true, todayHighlight:true});
			that.$("[name='endTime']").timePicker();
	    });		
		
        return this;
    },
	
    events: {
        "change input[type='text']"	: "change",
		"click .save"				: "save",
		"click .cancel"				: "cancel",
		"click #deleteButton"		: "beforeDelete",
    },
	
	change: function (event) {
        // Apply the change to the model
        var target = event.target;
        var change = {};
		
		if (target.name == "startDate") {
			change["startTime"] = $.trim(target.value) + " " + $("[name='startTime']").val() + " Europe/Stockholm";
		} else if (target.name == "startTime") {
			if ($.trim(target.value) == "") {
				$("[name='startTime']").val("00:00");
				change["startTime"] = $("[name='startDate']").val() + " 00:00 Europe/Stockholm";
			} else {
				change["startTime"] = $("[name='startDate']").val() + " " + $.trim(target.value) + " Europe/Stockholm";
			}
		} else if (target.name == "endDate") {
			change["endTime"] = $.trim(target.value) + " " + $("[name='endTime']").val() + " Europe/Stockholm";
		} else if (target.name == "endTime") {
			change["endTime"] = $("[name='endDate']").val() + " " + $.trim(target.value) + " Europe/Stockholm";
		} else {
			change[target.name] = $.trim(target.value);
		}

        this.model.set(change);
    },
	
	save: function() {
		if ($.trim($("[name='startTime']").val()) == "") {
			this.model.set("startTime", $("[name='startDate']").val() + " 00:00 Europe/Stockholm");
		}
		
		var self = this;
		this.model.save(null, {
            success: function (model, response) {
				window.headerView.showAlert({type:"alert-success", message:"The event was saved"}, {keepAlert:true});
				app.navigate("events/" + model.id, {trigger: true});
            },
            error: function (model, response) {
				var errors = null;
				try {
					errors = $.parseJSON(response.responseText);						
				} catch (error) {
					errors = [{property:"", message:response.responseText}];
				}
					
                window.headerView.showAlert({type:"alert-error", message:"Couldn't save event", errors:errors});
            }
        });
		return false;
	},
	
	cancel: function() {
	    window.headerView.removeAlert();
		if (this.model.id) {
			app.navigate("events/" + this.model.id, {trigger: true});			
		} else {
			app.navigate("eventweek", {trigger: true});	
		}
		return false;
	},

	beforeDelete: function() {
		var confirmed = confirm('Are you sure you want to delete this event?');
		if (confirmed) {
			this.delete();
		}
		return false;
	},
	
	delete: function() {
		var self = this;
		
		if (this.model.id) {
    		this.model.destroy({
                success: function (model, response) {
					window.headerView.showAlert({type:"alert-success", message:"The event was deleted"}, {keepAlert:true});
    				app.navigate("eventweek", {trigger: true});
                },
                error: function (model, response) {
                    window.headerView.showAlert({type:"alert-error", message:"Couldn't delete event"});
                }
            });   
		} else {
		    window.headerView.removeAlert();
			app.navigate("eventweek", {trigger: true});
		}
		return false;
	}
});