window.ThemeCollectionView = Backbone.View.extend({
	template : 'ThemeCollectionView',

	initialize : function() {
		console.log('Initializing ThemeCollectionView');
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
		app.navigate("themes/new", {
			trigger : true
		});
	}
});