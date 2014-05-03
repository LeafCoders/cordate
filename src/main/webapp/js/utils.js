'use strict';

/* Utils */

function stringToTime(rosetteDate) {
    var yearNumber = parseInt(rosetteDate.substring(0, 4), 10);
    var monthNumber = parseInt(rosetteDate.substring(5, 7), 10) - 1;
    var dayNumber = parseInt(rosetteDate.substring(8, 10), 10);
    return new Date(yearNumber, monthNumber, dayNumber);
}

function referenceToText(ref, refType) {
	if (ref != null) {
		if (Array.isArray(ref)) {
			// TODO: Handle multiple references
		} else {
			if (ref.referredObject != null) {
				switch (refType) {
					case 'location': return ref.referredObject.name; break;
				}
			} else if (ref.text != null) {
				return ref.text;
			}
		}
	}
	return null;
}

function referenceToObject(ref) {
    if (ref != null) {
        if (Array.isArray(ref)) {
            // TODO: Handle multiple references
        } else {
             return ref.referredObject;
        }
    }
    return null;
}

/**
 * Parse lines of text to objects specified by a format.
 * 
 * @param text    Line of text that should be parsed. Must end with '\n'
 * @param format  An array with object with format { text: 'Text to find', value: 'Name of param to set found text to' } 
 */
function parseVerticalTextByFormat(text, format) {

    var parseRow = function(expectedType, row) {
        if (row.trim().indexOf(expectedType) == 0) {
            return row.substr(expectedType.length).trim();
        }
        return null;
    };
    
    var rowsToFormat = function(rows, format, startRowIndex) {
        var data = {};
        for (var i = 0; i < format.length; i++) {
            data[format[i].value] = parseRow(format[i].text, rows[startRowIndex + i]);
        }
        return data;
    };

    var rows = text.split('\n');
    var dataList = { success: [], errors : [] };
    var startText = format[0].text, numRows = rows.length, i;
    for (i = 0; i < numRows; i++) {
        if (rows[i].trim().indexOf(startText) >= 0) {
            // Read data from rows
            var data = rowsToFormat(rows, format, i);

            // Validate that all members are set
            var allIsSet = true;
            for (var member in data) {
                allIsSet &= (data[member] != null);
            }        
            if (allIsSet) {
                dataList.success.push(data);
                i += format.length - 1;
            } else {
                dataList.errors.push({ row : i, errorText : rows[i].replace(/\t/g, ' ') });
            }
        } else if (rows[i].trim() != '') {
            dataList.errors.push({ row : i, errorText : rows[i].replace(/\t/g, ' ') });
        }
    }
    return dataList;
}
