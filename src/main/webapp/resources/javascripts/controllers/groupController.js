window.GroupController = {
	groups: function () {
		window.currentView = "groups";
		
        var groupCollection = new GroupCollection();
	
		var that = this;
		groupCollection.fetch({
			success: function() {
				if (window.currentContentView) {
					window.currentContentView.undelegateEvents();
				}
				window.currentContentView = new GroupCollectionView({model:groupCollection, el:$("#content")});
			},
			error: app.errorHandler
		});
    },
	
    group: function (id) {
    	window.currentView = "groups";
    	
		if (id) {
	        var group = new Group({id: id});
		
			var that = this;
			group.fetch({
				success: function() {
					if (window.currentContentView) {
						window.currentContentView.undelegateEvents();
					}
					window.currentContentView = new GroupView({model:group, el:$("#content")});
				},
				error: app.errorHandler
			});
		}
    },
	
    groupEdit: function (id) {
    	window.currentView = "groups";
    	
        var group = new Group({id: id});
		
		var that = this;
		group.fetch({
			success: function() {
				if (window.currentContentView) {
					window.currentContentView.undelegateEvents();
				}
				window.currentContentView = new GroupEditView({model:group, el:$("#content")});
			},
			error: app.errorHandler
		});
    },
	
    groupNew: function (id) {
    	window.currentView = "groups";
    	
        var group = new Group();
		
		if (window.currentContentView) {
			window.currentContentView.undelegateEvents();
		}
		window.currentContentView = new GroupEditView({model:group, el:$("#content")});		
    }
};