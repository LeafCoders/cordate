window.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "events": "events"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.render().el);
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!this.homeView) {
            this.homeView = new HomeView();
            this.homeView.render();
        } else {
            this.homeView.delegateEvents(); // delegate events when the view is recycled
        }
        $("#content").html(this.homeView.el);
        this.headerView.select('home-menu');
    },

    events: function () {
        this.eventCollection = new EventCollection();
        this.eventCollectionView = new EventCollectionView({model:this.eventCollection});
        this.eventCollection.fetch();
        
        $('#content').html(this.eventCollectionView.render().el);
        this.headerView.select('events-menu');
    }

});

templateLoader.load(["HeaderView", "HomeView", "EventView"],
    function () {
        app = new Router();
        Backbone.history.start();
    });