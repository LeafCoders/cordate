window.PermissionCollectionView = Backbone.View.extend({
	template : 'PermissionCollectionView',

	initialize : function() {
		console.log('Initializing PermissionCollectionView');
		this.render();
	},

	render : function() {
		window.headerView.updateSelectedSection();
		
		var that = this;
		window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);

			var collection = [];
			_.each(that.model.models, function(permission) {
				collection.push(permission.toJSON());
			}, that);

			var html = template({
				models : collection
			});

			that.$el.html(html);
		});

		return this;
	},

	events : {
		"click #create" : "create",
		"click tr" 		: "showItem"
	},

	create : function() {
		app.navigate("permissions/new", {
			trigger : true
		});
	},
	
	showItem : function(event) {
		var id = event.currentTarget.getAttribute('id');
		app.navigate("permissions/" + id, {
			trigger : true
		});
	}
});