'use strict';

/* Filters */

angular.module('myApp.filters', []).
    filter('interpolate', [ 'version', function (version) {
    return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    };
} ]).
    filter('capitalize',function () {
        return function (input, scope) {
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        };
    }).
    filter('commonPermissions',function () {
        return function (items, scope) {
            var arrayToReturn = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].everyone != null) {
                    arrayToReturn.push(items[i]);
                }
            }
            return arrayToReturn;
        };
    }).
    filter('groupPermissions',function () {
        return function (items, scope) {
            var arrayToReturn = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].groupId != null) {
                    arrayToReturn.push(items[i]);
                }
            }
            return arrayToReturn;
        };
    }).
    filter('userPermissions',function () {
        return function (items, scope) {
            var arrayToReturn = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].userId != null) {
                    arrayToReturn.push(items[i]);
                }
            }
            return arrayToReturn;
        };
    }).
    filter('dateRange', [ '$filter', function (filter) {
    return function (text) {
        var sinceDayNumber = parseInt(text.substring(8, 10), 10);
        var sinceMonthNumber = parseInt(text.substring(5, 7), 10);
        var sinceYearNumber = parseInt(text.substring(0, 4), 10);

        var untilDayNumber = parseInt(text.substring(19, 21), 10);
        var untilMonthNumber = parseInt(text.substring(16, 18), 10);
        var untilYearNumber = parseInt(text.substring(11, 15), 10);

        var range = sinceDayNumber;
        if (sinceYearNumber != untilYearNumber ||
            (sinceYearNumber == untilYearNumber && sinceMonthNumber != untilMonthNumber)) {
            range += " " + filter('lowercase')(filter('monthName')(sinceMonthNumber));
        }
        if (sinceYearNumber != untilYearNumber) {
            range += " " + sinceYearNumber;
        }
        range += " - ";
        range += untilDayNumber;
        range += " " + filter('lowercase')(filter('monthName')(untilMonthNumber));
        range += " " + untilYearNumber;

        return range;
    };
}]).
    filter('monthName',function () {
        return function (monthNumber) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[monthNumber - 1];
        }
    }).
    filter('dayName',function () {
        return function (dayNumber) {
            var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            return weekdays[dayNumber - 1];
        }
    }).
    filter('dayNumber',function () {
        return function (text) {
            return parseInt(text.substring(8, 10), 10);
        }
    }).
    filter('time', function () {
        return function (text) {
            var time = null;
            if (text && text.length >= 16) {
                time = text.substring(11, 16);
            }
            return time;
        }
    }).
    filter('date', function () {
        return function (text) {
            var date = null;
            if (text && text.length >= 10) {
                date = text.substring(0, 10);
            }
            return date;
        }
    });