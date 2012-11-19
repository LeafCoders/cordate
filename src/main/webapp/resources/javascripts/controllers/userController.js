window.UserController = {
	users: function () {
		window.currentView = "users";
		
        var userCollection = new UserCollection();
	
		var that = this;
		userCollection.fetch({
			success: function() {
				if (window.currentContentView) {
					window.currentContentView.undelegateEvents();
				}
				window.currentContentView = new UserCollectionView({model:userCollection, el:$("#content")});
			},
			error: app.errorHandler
		});
    },
	
    user: function (id) {
    	window.currentView = "users";
    	
		if (id) {
	        var user = new User({id: id});
		
			var that = this;
			user.fetch({
				success: function() {
					if (window.currentContentView) {
						window.currentContentView.undelegateEvents();
					}
					window.currentContentView = new UserView({model:user, el:$("#content")});
				},
				error: app.errorHandler
			});
		}
    },
	
    userEdit: function (id) {
    	window.currentView = "users";
    	
        var user = new User({id: id});
		
		var that = this;
		user.fetch({
			success: function() {
				if (window.currentContentView) {
					window.currentContentView.undelegateEvents();
				}
				window.currentContentView = new UserEditView({model:user, el:$("#content")});
			},
			error: app.errorHandler
		});
    },
	
    userNew: function (id) {
    	window.currentView = "users";
    	
        var user = new User();
		
		if (window.currentContentView) {
			window.currentContentView.undelegateEvents();
		}
		window.currentContentView = new UserEditView({model:user, el:$("#content")});		
    }
};