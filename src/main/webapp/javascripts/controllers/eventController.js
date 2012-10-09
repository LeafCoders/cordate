window.EventController = {
		
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
			var themeCollection = new ThemeCollection();
			themeCollection.fetch({success: function(model) {
				var collection = [];
				_.each(model.models, function(theme) {
					collection.push(theme.toJSON());
				}, that);
				event.set("themes", collection);
				
				window.eventEditView = new EventEditView({model:event, el:$("#content")});
				window.headerView.select('events-menu');
			}});
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
};