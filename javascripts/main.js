window.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "events": "events",
        "events/new": "eventNew",
        "events/:id": "event",
        "events/:id/edit": "eventEdit"
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
        var eventCollection = new EventCollection();

		var that = this;
		eventCollection.fetch({success: function() {
			$("#content").html(new EventCollectionView({model:eventCollection}).el);
			
			that.headerView.select('events-menu');
		}});
    },
	
    event: function (id) {
        var event = new Event({id: id});
		
		var that = this;
		event.fetch({success: function() {
			$("#content").html(new EventView({model:event}).el);
			that.headerView.select('events-menu');	
		}});
    },
	
    eventEdit: function (id) {
        var event = new Event({id: id});
		
		var that = this;
		event.fetch({success: function() {
			$("#content").html(new EventEditView({model:event}).el);
			that.headerView.select('events-menu');
		}});
    },
	
    eventNew: function (id) {
        var event = new Event();
		
		var that = this;
		event.fetch({success: function() {
			$("#content").html(new EventEditView({model:event}).el);
			that.headerView.select('events-menu');
		}});
    }
	
});

$(function () {
    app = new Router();
	$.ajaxSetup({ cache: false });
    Backbone.history.start();
});