window.templateManager = {
	templates : {},
	get : function(id, callback) {
		var template = this.templates[id];

		if (template) {
			callback(template);
		} else {
			var that = this;		
			$.get("resources/templates/" + id + ".html", function(template) {
				that.templates[id] = template;
				callback(template);
			}, 'text');
		}
	}
};
