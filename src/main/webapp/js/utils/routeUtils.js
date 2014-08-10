'use strict';

var utils = utils || {};

utils.createBasicAllRoute = function(routeProvider, name, resolve) {
    var templateUrl = 'modules/' + name + '/html/' + name + '.html';
    routeProvider.when('/' + name, {
        templateUrl: templateUrl,
        controller:  name + 'Controller',
        resolve:     resolve
    });
};
    
utils.createBasicOneRoute = function(routeProvider, name, resolveShow, resolveEdit) {
    if (resolveEdit == null) {
        resolveEdit = resolveShow;
    }
    var single = name.slice(0, - 1);
    var templateBaseUrl = 'modules/' + name + '/html/' + single;
    routeProvider.when('/' + name + '/new', {
        templateUrl: templateBaseUrl + 'Editor.html',
        controller:  single + 'EditorController',
        resolve:     resolveEdit
    });
    routeProvider.when('/' + name + '/:id', {
        templateUrl: templateBaseUrl + '.html',
        controller:  single + 'Controller',
        resolve:     resolveShow
    });
    routeProvider.when('/' + name + '/:id/edit', {
        templateUrl: templateBaseUrl + 'Editor.html',
        controller:  single + 'EditorController',
        resolve:     resolveEdit
    });
};
    

