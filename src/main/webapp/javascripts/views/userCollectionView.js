window.UserCollectionView = Backbone.View.extend({
	template : 'UserCollectionView',

	initialize : function() {
		console.log('Initializing UserCollectionView');
		this.render();
	},

	render : function() {
		var that = this;
		window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);

			var collection = [];
			_.each(that.model.models, function(theme) {
				collection.push(theme.toJSON());
			}, that);

			var html = template({
				models : collection
			});

			that.$el.html(html);
		});

		return this;
	},

	events : {
		"click .create" : "create"
	},

	create : function() {
		app.navigate("users/new", {
			trigger : true
		});
	}
});