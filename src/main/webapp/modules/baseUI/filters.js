'use strict';

(function () {

    var thisModule = angular.module('baseUI');

    thisModule.filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]);

    thisModule.filter('capitalize', function() {
        return function(input, scope) {
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        };
    });

    thisModule.filter('cordateDateRange', ['$filter', function($filter) {
        return function(text) {
            var sinceDayNumber = parseInt(text.substring(8, 10), 10);
            var sinceMonthNumber = parseInt(text.substring(5, 7), 10);
            var sinceYearNumber = parseInt(text.substring(0, 4), 10);
    
            var untilDayNumber = parseInt(text.substring(19, 21), 10);
            var untilMonthNumber = parseInt(text.substring(16, 18), 10);
            var untilYearNumber = parseInt(text.substring(11, 15), 10);
    
            var range = sinceDayNumber;
            if (sinceYearNumber != untilYearNumber ||
                (sinceYearNumber == untilYearNumber && sinceMonthNumber != untilMonthNumber)) {
                range += " " + $filter('lowercase')($filter('t')($filter('cordateMonthName')(sinceMonthNumber)));
            }
            if (sinceYearNumber != untilYearNumber) {
                range += " " + sinceYearNumber;
            }
            range += " - ";
            range += untilDayNumber;
            range += " " + $filter('lowercase')($filter('t')($filter('cordateMonthName')(untilMonthNumber)));
            range += " " + untilYearNumber;
    
            return range;
        };
    }]);

    thisModule.filter('cordateMonthName', function() {
        return function(monthNumber) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[monthNumber - 1];
        };
    });

    thisModule.filter('cordateDayName', function() {
        return function(dayNumber) {
            var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            return weekdays[dayNumber - 1];
        };
    });

    thisModule.filter('cordateDayNumber', function() {
        return function(text) {
            return parseInt(text.substring(8, 10), 10);
        };
    });

    thisModule.filter('cordateTime', function() {
        return function(text) {
            var time = null;
            if (text && text.length >= 16) {
                time = text.substring(11, 16);
            }
            return time;
        };
    });

    thisModule.filter('cordateDate', function() {
        return function(text) {
            var date = null;
            if (text && text.length >= 10) {
                date = text.substring(0, 10);
            }
            return date;
        };
    });

    thisModule.filter('cordateBool', ['$filter', function($filter) {
        return function(boolValue) {
            return $filter('t')(!!boolValue ? 'yes' : 'no');
        };
    }]);

    thisModule.filter('t', ['translationMap', '$parse', '$filter', function(translationMap, $parse, $filter) {
        return function(input, values) {
            var translation = translationMap[input];
            if (translation == undefined) {
                return input;
            } else if (values != null) {
                var tvalues = {};
                angular.forEach(values, function(value, key) {
                    tvalues[key] = $filter('t')(value);
                });
                
                // Handles the following format: {{ 'Show person: {{title}}' | t: {title: 'Kalle'} }}
                return translation.replace(/{{\S*}}/g, function(m,key) {
                    return $parse(m.replace(/[{} ]/g, ''))(tvalues);
                });
            }
            return translation;
        };
    }]);

    thisModule.filter('newlineToBr', function() {
        return function(input, scope) {
            return input ? input.replace(/\n/g, '<br>') : input;
        };
    });

    thisModule.filter('startFrom', function() {
        return function(input, start) {
            if (input) {
                start = +start;
                return input.slice(start);
            } else {
                return [];
            }
        };
    });

}());
