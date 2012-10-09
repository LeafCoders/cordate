window.UserController = {
	users: function () {
        var userCollection = new UserCollection();
	
		var that = this;
		userCollection.fetch({success: function() {
			if (window.userCollectionView) {
				window.userCollectionView.undelegateEvents();
			}
			window.userCollectionView = new UserCollectionView({model:userCollection, el:$("#content")});
			window.headerView.select('users-menu');
		}});
    },
	
    user: function (id) {
		if (id) {
	        var user = new User({id: id});
		
			var that = this;
			user.fetch({success: function() {
				if (window.userView) {
					window.userView.undelegateEvents();
				}
				window.userView = new UserView({model:user, el:$("#content")});
				window.headerView.select('users-menu');
			}});
		}
    },
	
    userEdit: function (id) {
        var user = new User({id: id});
		
		var that = this;
		user.fetch({success: function() {
			if (window.userEditView) {
				window.userEditView.undelegateEvents();
			}
			window.userEditView = new UserEditView({model:user, el:$("#content")});
			window.headerView.select('users-menu');
		}});
    },
	
    userNew: function (id) {
        var user = new User();
		
		if (window.userEditView) {
			window.userEditView.undelegateEvents();
		}
		window.userEditView = new UserEditView({model:user, el:$("#content")});
			
		window.headerView.select('users-menu');
    }
};