window.PermissionController = {
	permissions: function () {
		window.currentView = "permissions";
		
        var permissionCollection = new PermissionCollection();
	
		var that = this;
		permissionCollection.fetch({
			success: function() {
				if (window.currentContentView) {
					window.currentContentView.undelegateEvents();
				}
				window.currentContentView = new PermissionCollectionView({model:permissionCollection, el:$("#content")});
			},
			error: app.errorHandler
		});
    },
	
    permission: function (id) {
    	window.currentView = "permissions";
    	
		if (id) {
	        var permission = new Permission({id: id});
		
			var that = this;
			permission.fetch({
				success: function() {
					if (window.currentContentView) {
						window.currentContentView.undelegateEvents();
					}				
					window.currentContentView = new PermissionView({model:permission, el:$("#content")});
				},
				error: app.errorHandler
			});
		}
    },
	
    permissionEdit: function (id) {
    	window.currentView = "permissions";
    	
		if (id) {
	        var permission = new Permission({id: id});
		
			var that = this;
			permission.fetch({
				success: function() {
					window.PermissionController.getGroupsAndUsers(function (groups, users) {
						permission.set("groups", groups);
			        	permission.set("users", users);
			        	
			        	if (window.currentContentView) {
							window.currentContentView.undelegateEvents();
						}
			        	window.currentContentView = new PermissionEditView({model:permission, el:$("#content")});	
			        });
				},
				error: app.errorHandler
			});
		}
    },
	
    permissionNew: function () {
    	window.currentView = "permissions";
    	
        var permission = new Permission();
        permission.set("everyone", true);
        
        window.PermissionController.getGroupsAndUsers(function (groups, users) {
        	permission.set("groups", groups);
        	permission.set("users", users);
        	
        	if (window.currentContentView) {
    			window.currentContentView.undelegateEvents();
    		}
        	window.currentContentView = new PermissionEditView({model:permission, el:$("#content")});	
        });
    },
    
    getGroupsAndUsers: function (callback) {
    	var groups = null;
    	var users = null;
    	
    	var groupsDownloaded = false;
		var usersDownloaded = false;
		
		var that = this;
		
		var groupCollection = new GroupCollection();
		groupCollection.fetch({
			success: function(model) {
				var collection = [];
				_.each(model.models, function(group) {
					collection.push(group.toJSON());
				}, that);
				groups = collection;
				groupsDownloaded = true;
				
				if (usersDownloaded && groupsDownloaded) {
					callback(groups, users);
				}
			},
			error: app.errorHandler
		});
		
		var userCollection = new UserCollection();
		userCollection.fetch({
			success: function(model) {
				var collection = [];
				_.each(model.models, function(user) {
					collection.push(user.toJSON());
				}, that);
				users = collection;
				usersDownloaded = true;
				
				if (usersDownloaded && groupsDownloaded) {
					callback(groups, users);
				}
			},
			error: app.errorHandler
		});
    }
};