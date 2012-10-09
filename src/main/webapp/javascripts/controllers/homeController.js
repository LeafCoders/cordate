window.HomeController = {
		
	home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!window.homeView) {
            window.homeView = new HomeView();
            window.homeView.render();
        } else {
            window.homeView.delegateEvents(); // delegate events when the view is recycled
        }
        $("#content").html(window.homeView.el);
        window.headerView.select('home-menu');
    }
};