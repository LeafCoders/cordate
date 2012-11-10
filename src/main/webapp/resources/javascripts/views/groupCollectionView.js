window.GroupCollectionView = Backbone.View.extend({
	template : 'GroupCollectionView',

	initialize : function() {
		console.log('Initializing GroupCollectionView');
		this.render();
	},

	render : function() {
		window.headerView.updateSelectedSection();
		
		var that = this;
		window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);

			var collection = [];
			_.each(that.model.models, function(group) {
				collection.push(group.toJSON());
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
		app.navigate("groups/new", {
			trigger : true
		});
	},
	
	showItem : function(event) {
		var id = event.currentTarget.getAttribute('id');
		app.navigate("groups/" + id, {
			trigger : true
		});
	}
});