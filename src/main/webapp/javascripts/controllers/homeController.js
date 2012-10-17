window.HomeController = {
		
	home: function () {
		window.currentView = "home";
		
        if (window.currentContentView) {
        	window.currentContentView.undelegateEvents();
        }
        
        window.currentContentView = new HomeView({el:$("#content")});
    }
};