window.ThemeController = {
	themes: function () {
        var themeCollection = new ThemeCollection();
	
		var that = this;
		themeCollection.fetch({success: function() {
			if (window.themeCollectionView) {
				window.themeCollectionView.undelegateEvents();
			}
			window.themeCollectionView = new ThemeCollectionView({model:themeCollection, el:$("#content")});
			window.headerView.select('themes-menu');
		}});
    },
	
    theme: function (id) {
		if (id) {
	        var theme = new Theme({id: id});
		
			var that = this;
			theme.fetch({success: function() {
				if (window.themeView) {
					window.themeView.undelegateEvents();
				}
				window.themeView = new ThemeView({model:theme, el:$("#content")});
				window.headerView.select('themes-menu');
			}});
		}
    },
	
    themeEdit: function (id) {
        var theme = new Theme({id: id});
		
		var that = this;
		theme.fetch({success: function() {
			if (window.themeEditView) {
				window.themeEditView.undelegateEvents();
			}
			window.themeEditView = new ThemeEditView({model:theme, el:$("#content")});
			window.headerView.select('themes-menu');
		}});
    },
	
    themeNew: function (id) {
        var theme = new Theme();
		
		if (window.themeEditView) {
			window.themeEditView.undelegateEvents();
		}
		window.themeEditView = new ThemeEditView({model:theme, el:$("#content")});
			
		window.headerView.select('themes-menu');
    }
};