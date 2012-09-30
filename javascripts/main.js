window.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "events": "events",
        "events/new": "eventNew",
        "events/:id": "event",
        "events/:id/edit": "eventEdit"
    },

    initialize: function () {
        window.headerView = new HeaderView({el:$("#header")});
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
        window.headerView.select('home-menu');
    },

    events: function () {
        var eventweek = new Eventweek();
		
		var that = this;
		eventweek.fetch({success: function() {
			if (window.eventweekView) {
				window.eventweekView.undelegateEvents();
			}
			window.eventweekView = new EventweekView({model:eventweek, el:$("#content")});
			window.headerView.select('events-menu');	
		}});

    },
	
    event: function (id) {
        var event = new Event({id: id});
		
		var that = this;
		event.fetch({success: function() {
			if (window.eventView) {
				window.eventView.undelegateEvents();
			}
			window.eventView = new EventView({model:event, el:$("#content")});
			window.headerView.select('events-menu');	
		}});
    },
	
    eventEdit: function (id) {
        var event = new Event({id: id});
		
		var that = this;
		event.fetch({success: function() {
			if (window.eventEditView) {
				window.eventEditView.undelegateEvents();
			}
			window.eventEditView = new EventEditView({model:event, el:$("#content")});
			window.headerView.select('events-menu');
		}});
    },
	
    eventNew: function (id) {
        var now = new Date();
        var date = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2) + "-" + ('0' + now.getDate()).slice(-2);
        var defaultStartTime = date + " 11:00 Europe/Stockholm";
        
        var event = new Event({startTime:defaultStartTime});
		
		if (window.eventEditView) {
			window.eventEditView.undelegateEvents();
		}
		window.eventEditView = new EventEditView({model:event, el:$("#content")});
			
		window.headerView.select('events-menu');
    }
	
});

$(function () {
    app = new Router();
	$.ajaxSetup({ cache: false });
	
	Handlebars.registerHelper('date', function(dateTime) {
		var date = '';
		if (dateTime && dateTime.length >= 10)
			date = dateTime.substring(0, 10);
		return date;
	});
	Handlebars.registerHelper('time', function(dateTime) {
		var time = '';
		if (dateTime && dateTime.length >= 16)
			time = dateTime.substring(11, 16);
		return time;
	});
	Handlebars.registerHelper('month', function(monthNumber) {
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		
		return months[monthNumber - 1];
	});
    Backbone.history.start();
});