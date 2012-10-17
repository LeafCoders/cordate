window.EventweekView = Backbone.View.extend({
 
	template: 'EventweekView',
	
	initialize:function() {
		console.log('Initializing EventweekView');
		this.render();
	},
    
    render:function(eventName) {
    	window.headerView.updateSelectedSection();
    	
		var that = this;
	    window.templateManager.get(this.template, function(templateSource) {
			var template = Handlebars.compile(templateSource);
			
			var dayFromDateSince = Handlebars.helpers['dayFromDate'](that.model.get('since'));
			var monthFromDateSince = Handlebars.helpers['monthFromDate'](that.model.get('since'));
			var yearFromDateSince = Handlebars.helpers['yearFromDate'](that.model.get('since'));
			
			var dayFromDateUntil = Handlebars.helpers['dayFromDate'](that.model.get('until'));
			var monthFromDateUntil = Handlebars.helpers['monthFromDate'](that.model.get('until'));
			var yearFromDateUntil = Handlebars.helpers['yearFromDate'](that.model.get('until'));
			
			var range = dayFromDateSince;
			if (yearFromDateSince != yearFromDateUntil ||
				(yearFromDateSince == yearFromDateUntil && monthFromDateSince != monthFromDateUntil)) {
				range += " " + monthFromDateSince;
			}
			if (yearFromDateSince != yearFromDateUntil) {
				range +=" " +  yearFromDateSince;
			}
			range += " - ";
			range += dayFromDateUntil;
			range += " " + monthFromDateUntil;
			range += " " + yearFromDateUntil;
			that.model.set('range', range);
			
			var model = that.model.toJSON();			
			var html = template(model);
			
			that.$el.html(html);			
	    });
		
        return this;
    },
    
    events : {
		"click tr" 		: "showItem"
	},
	
	showItem : function(event) {
		var id = event.currentTarget.getAttribute('id');
		app.navigate("events/" + id, {
			trigger : true
		});
	}
});
