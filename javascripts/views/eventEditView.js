window.EventEditView = Backbone.View.extend({
 
 	id: "editor",
	
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
	    });
		
        return this;
    },
	
    events: {
        "change input[type='text']"	: "change",
		"click .save"				: "beforeSave",
		"click .cancel"				: "cancel",
		"click .delete"				: "beforeDelete"
    },
	
	change: function (event) {
        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },
	
	beforeSave: function () {
		this.save();
        return false;
    },
	
	save: function() {
		var self = this;
		this.model.save(null, {
            success: function (model) {
				app.navigate("events/" + model.id, {trigger: true, replace: true});
            },
            error: function () {
                alert(0);
            }
        });
	},
	
	cancel: function() {
		app.navigate("events/" + this.model.id, {trigger: true, replace: true});
	},
	
	beforeDelete: function () {
		this.delete();
        return false;
    },
	
	delete: function() {
		var self = this;
		this.model.destroy({
            success: function (model) {
				app.navigate("events", {trigger: true, replace: true});
            },
            error: function () {
                alert(0);
            }
        });
	}
});