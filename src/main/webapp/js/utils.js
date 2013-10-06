'use strict';

/* Utils */

function stringToTime(rosetteDate) {
    var yearNumber = parseInt(rosetteDate.substring(0, 4), 10);
    var monthNumber = parseInt(rosetteDate.substring(5, 7), 10) - 1;
    var dayNumber = parseInt(rosetteDate.substring(8, 10), 10);
    return new Date(yearNumber, monthNumber, dayNumber);
}
