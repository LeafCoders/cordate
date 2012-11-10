window.ThemeController = {
	themes: function () {
		window.currentView = "themes";
		
        var themeCollection = new ThemeCollection();
	
		var that = this;
		themeCollection.fetch({success: function() {
			if (window.currentContentView) {
				window.currentContentView.undelegateEvents();
			}
			window.currentContentView = new ThemeCollectionView({model:themeCollection, el:$("#content")});
		}});
    },
	
    theme: function (id) {
    	window.currentView = "themes";
    	
		if (id) {
	        var theme = new Theme({id: id});
		
			var that = this;
			theme.fetch({success: function() {
				if (window.currentContentView) {
					window.currentContentView.undelegateEvents();
				}
				window.currentContentView = new ThemeView({model:theme, el:$("#content")});
			}});
		}
    },
	
    themeEdit: function (id) {
    	window.currentView = "themes";
    	
        var theme = new Theme({id: id});
		
		var that = this;
		theme.fetch({success: function() {
			if (window.currentContentView) {
				window.currentContentView.undelegateEvents();
			}
			window.currentContentView = new ThemeEditView({model:theme, el:$("#content")});
		}});
    },
	
    themeNew: function () {
    	window.currentView = "themes";
    	
        var theme = new Theme();
		
		if (window.currentContentView) {
			window.currentContentView.undelegateEvents();
		}
		window.currentContentView = new ThemeEditView({model:theme, el:$("#content")});
    }
};