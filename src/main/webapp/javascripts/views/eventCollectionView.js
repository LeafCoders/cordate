window.EventCollectionView = Backbone.View.extend({
	template : 'EventCollectionView',

	initialize : function() {
		console.log('Initializing EventCollectionView');
		this.render();
	},

	render : function() {
		var that = this;
		window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);

			var collection = [];
			_.each(that.model.models, function(event) {
				collection.push(event.toJSON());
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
		app.navigate("events/new", {
			trigger : true
		});
	}
});