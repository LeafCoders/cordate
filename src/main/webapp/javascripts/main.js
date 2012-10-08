window.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "eventweek": "eventweekcurrent",
        "eventweek/:id": "eventweek",
        "events/new": "eventNew",
        "events/:id": "event",
        "events/:id/edit": "eventEdit",
        "themes": "themes",
        "themes/new": "themeNew",
        "themes/:id": "theme",
        "themes/:id/edit": "themeEdit"
    },

    initialize: function () {
        window.headerView = new HeaderView({el:$("#header")});
    },

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
    },

    eventweekcurrent: function () {
        var eventweek = new Eventweek();
		
		var that = this;
		var request = eventweek.fetch({success: function() {
			if (window.eventweekView) {
				window.eventweekView.undelegateEvents();
			}
			
			var link_headers = parse_link_header(request.getResponseHeader('Link'));
			eventweek.set('previous_page', link_headers['previous']);
			eventweek.set('next_page', link_headers['next']);
			
			window.eventweekView = new EventweekView({model:eventweek, el:$("#content")});
			window.headerView.select('events-menu');	
		}});

    },
	
    eventweek: function (id) {
        var eventweek = new Eventweek({id: id});
		
		var that = this;
		var request = eventweek.fetch({success: function() {
			if (window.eventweekView) {
				window.eventweekView.undelegateEvents();
			}
			
			var link_headers = parse_link_header(request.getResponseHeader('Link'));
			eventweek.set('previous_page', link_headers['previous']);
			eventweek.set('next_page', link_headers['next']);
			
			window.eventweekView = new EventweekView({model:eventweek, el:$("#content")});
			window.headerView.select('events-menu');	
		}});

    },
	
    event: function (id) {
		if (id) {
	        var event = new Event({id: id});
		
			var that = this;
			event.fetch({success: function() {
				if (window.eventView) {
					window.eventView.undelegateEvents();
				}
				window.eventView = new EventView({model:event, el:$("#content")});
				window.headerView.select('events-menu');
			}});
		}
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
    },

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
	
});

$(function () {
	$.ajaxSetup({ cache: false });
	
	Handlebars.registerHelper('dateFromDateTime', function(dateTime) {
		var date = '';
		if (dateTime && dateTime.length >= 10)
			date = dateTime.substring(0, 10);
		return date;
	});
	Handlebars.registerHelper('timeFromDateTime', function(dateTime) {
		var time = '';
		if (dateTime && dateTime.length >= 16)
			time = dateTime.substring(11, 16);
		return time;
	});
	Handlebars.registerHelper('monthFromMonthNumber', function(monthNumber) {
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return months[monthNumber - 1];
	});
	Handlebars.registerHelper('weekdayFromDayNumber', function(dayNumber) {
		var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		return weekdays[dayNumber - 1];
	});
	Handlebars.registerHelper('dayFromDate', function(date) {
		var day = '';
		if (date && date.length >= 10) {
			day = parseInt(date.substring(8, 10), 10);
		}
		return day;
	});
	Handlebars.registerHelper('monthFromDate', function(date) {
		var monthText = '';
		if (date && date.length >= 10) {
			var month = parseInt(date.substring(5, 7), 10); 
			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			monthText = months[month - 1].toLowerCase();
		}
		return monthText;
	});
	Handlebars.registerHelper('yearFromDate', function(date) {
		var year = '';
		if (date && date.length >= 4) {
			year = date.substring(0, 4);
		}
		return year;
		
	});
	
	app = new Router();
	
    Backbone.history.start();
});