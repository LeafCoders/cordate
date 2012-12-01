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
        "themes/:id/edit": "themeEdit",
        
        "users": "users",
        "users/new": "userNew",
        "users/:id": "user",
        "users/:id/edit": "userEdit",
        
        "groups": "groups",
        "groups/new": "groupNew",
        "groups/:id": "group",
        "groups/:id/edit": "groupEdit",
        
        "permissions": "permissions",
        "permissions/new": "permissionNew",
        "permissions/:id": "permission",
        "permissions/:id/edit": "permissionEdit",
    },

    initialize: function () {
        window.headerView = new HeaderView({el:$("#header")});
    },

    home: window.HomeController.home,

    eventweekcurrent: window.EventController.eventweekcurrent,
    eventweek: window.EventController.eventweek,
    event: window.EventController.event,
    eventEdit: window.EventController.eventEdit,
    eventNew: window.EventController.eventNew,

    themes: window.ThemeController.themes,
    theme: window.ThemeController.theme,
    themeEdit: window.ThemeController.themeEdit,
    themeNew: window.ThemeController.themeNew,
    
    users: window.UserController.users,
    user: window.UserController.user,
    userEdit: window.UserController.userEdit,
    userNew: window.UserController.userNew,
    
    groups: window.GroupController.groups,
    group: window.GroupController.group,
    groupEdit: window.GroupController.groupEdit,
    groupNew: window.GroupController.groupNew,
    
    permissions: window.PermissionController.permissions,
    permission: window.PermissionController.permission,
    permissionEdit: window.PermissionController.permissionEdit,
    permissionNew: window.PermissionController.permissionNew,
    
    errorHandler: function(model, xhr, options) {
    	if (xhr.getResponseHeader("X-cordate-login") == "true") {
    		window.location.reload();
    	} else {
    		window.headerView.showAlert({type:"alert-error", message:"Error " + xhr.status + ". " + xhr.statusText, keepAlert:true});
    	}
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
	Handlebars.registerHelper('selected', function(option, value) {
        if (option == value) {
            return new Handlebars.SafeString(' selected');
        } else {
            return '';
        }
    });
	
	app = new Router();
	
    Backbone.history.start();
});