window.EventController = {
		
	eventweekcurrent: function () {
		window.currentView = "events";
		
        var eventweek = new Eventweek();
		
		var that = this;
		var request = eventweek.fetch({success: function() {
			if (window.currentContentView) {
				window.currentContentView.undelegateEvents();
			}
			
			var link_headers = parse_link_header(request.getResponseHeader('Link'));
			eventweek.set('previous_page', link_headers['previous']);
			eventweek.set('next_page', link_headers['next']);
			
			window.currentContentView = new EventweekView({model:eventweek, el:$("#content")});	
		}});

    },
	    
	eventweek: function (id) {
		window.currentView = "events";
		
        var eventweek = new Eventweek({id: id});
		
		var that = this;
		var request = eventweek.fetch({success: function() {
			if (window.currentContentView) {
				window.currentContentView.undelegateEvents();
			}
			
			var link_headers = parse_link_header(request.getResponseHeader('Link'));
			eventweek.set('previous_page', link_headers['previous']);
			eventweek.set('next_page', link_headers['next']);
			
			window.currentContentView = new EventweekView({model:eventweek, el:$("#content")});
		}});

    },
    
    event: function (id) {
    	window.currentView = "events";
    	
		if (id) {
	        var event = new Event({id: id});
		
			var that = this;
			event.fetch({success: function() {
				if (window.currentContentView) {
					window.currentContentView.undelegateEvents();
				}
				window.currentContentView = new EventView({model:event, el:$("#content")});
			}});
		}
    },
    
    eventEdit: function (id) {
    	window.currentView = "events";
    	
        var event = new Event({id: id});
		
		var that = this;
		event.fetch({success: function() {
			if (window.currentContentView) {
				window.currentContentView.undelegateEvents();
			}
			var themeCollection = new ThemeCollection();
			themeCollection.fetch({success: function(model) {
				var collection = [];
				_.each(model.models, function(theme) {
					collection.push(theme.toJSON());
				}, that);
				event.set("themes", collection);
				
				window.currentContentView = new EventEditView({model:event, el:$("#content")});
			}});
		}});
    },
    
    eventNew: function (id) {
    	window.currentView = "events";
    	
        var now = new Date();
        var date = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2) + "-" + ('0' + now.getDate()).slice(-2);
        var defaultStartTime = date + " 11:00 Europe/Stockholm";
        
        var event = new Event({startTime:defaultStartTime});
		
		if (window.currentContentView) {
			window.currentContentView.undelegateEvents();
		}
		
		var that = this;
		var themeCollection = new ThemeCollection();
		themeCollection.fetch({success: function(model) {
			var collection = [];
			_.each(model.models, function(theme) {
				collection.push(theme.toJSON());
			}, that);
			event.set("themes", collection);
			
			window.currentContentView = new EventEditView({model:event, el:$("#content")});	
		}});
    }
};