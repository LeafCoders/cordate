// http://mgcrea.github.io/angular-strap/ v0.7.5
/**
 * AngularStrap - Twitter Bootstrap directives for AngularJS
 * @version v0.7.5 - 2013-07-21
 * @link http://mgcrea.github.com/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('$strap.config', []).value('$strapConfig', {});
angular.module('$strap.filters', ['$strap.config']);
angular.module('$strap.directives', ['$strap.config']);
angular.module('$strap', [
  '$strap.filters',
  '$strap.directives',
  '$strap.config'
]);
'use strict';
angular.module('$strap.directives').factory('$modal', [
  '$rootScope',
  '$compile',
  '$http',
  '$timeout',
  '$q',
  '$templateCache',
  '$strapConfig',
  function ($rootScope, $compile, $http, $timeout, $q, $templateCache, $strapConfig) {
    var ModalFactory = function ModalFactory(config) {
      function Modal(config) {
        var options = angular.extend({ show: true }, $strapConfig.modal, config), scope = options.scope ? options.scope : $rootScope.$new(), templateUrl = options.template;
        return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, { cache: true }).then(function (res) {
          return res.data;
        })).then(function onSuccess(template) {
          var id = templateUrl.replace('.html', '').replace(/[\/|\.|:]/g, '-') + '-' + scope.$id;
          var $modal = $('<div class="modal in" tabindex="-1"></div>').attr('id', id).addClass('fade').html(template);
          if (options.modalClass)
            $modal.addClass(options.modalClass);
          $('body').append($modal);
          $timeout(function () {
            $compile($modal)(scope);
          });
          scope.$modal = function (name) {
            $modal.modal(name);
          };
          angular.forEach([
            'show',
            'hide'
          ], function (name) {
            scope[name] = function () {
              $modal.modal(name);
            };
          });
          scope.dismiss = scope.hide;
          angular.forEach([
            'show',
            'shown',
            'hide',
            'hidden'
          ], function (name) {
            $modal.on(name, function (ev) {
              scope.$emit('modal-' + name, ev);
            });
          });
          $modal.on('shown', function (ev) {
            $('input[autofocus], textarea[autofocus]', $modal).first().trigger('focus');
          });
          $modal.on('hidden', function (ev) {
            if (!options.persist)
              scope.$destroy();
          });
          scope.$on('$destroy', function () {
            $modal.remove();
          });
          $modal.modal(options);
          return $modal;
        });
      }
      return new Modal(config);
    };
    return ModalFactory;
  }
]).directive('bsModal', [
  '$q',
  '$modal',
  function ($q, $modal) {
    return {
      restrict: 'A',
      scope: true,
      link: function postLink(scope, iElement, iAttrs, controller) {
        var options = {
            template: scope.$eval(iAttrs.bsModal),
            persist: true,
            show: false,
            scope: scope
          };
        angular.forEach([
          'modalClass',
          'backdrop',
          'keyboard'
        ], function (key) {
          if (angular.isDefined(iAttrs[key]))
            options[key] = iAttrs[key];
        });
        $q.when($modal(options)).then(function onSuccess(modal) {
          iElement.attr('data-target', '#' + modal.attr('id')).attr('data-toggle', 'modal');
        });
      }
    };
  }
]);