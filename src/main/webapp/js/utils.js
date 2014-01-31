'use strict';

/* Utils */

function stringToTime(rosetteDate) {
    var yearNumber = parseInt(rosetteDate.substring(0, 4), 10);
    var monthNumber = parseInt(rosetteDate.substring(5, 7), 10) - 1;
    var dayNumber = parseInt(rosetteDate.substring(8, 10), 10);
    return new Date(yearNumber, monthNumber, dayNumber);
}

function referenceToText(ref, refType) {
	if (ref !== null) {
		if (Array.isArray(ref)) {
			// TODO: Handle multiple references
		} else {
			if (ref.referredObject !== null) {
				switch (refType) {
					case 'location': return ref.referredObject.name; break;
				}
			} else if (ref.text !== null) {
				return ref.text;
			}
		}
	}
	return null;
}
