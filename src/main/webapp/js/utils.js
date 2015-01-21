'use strict';

/* Utils */

function stringToTime(rosetteDate) {
    var yearNumber = parseInt(rosetteDate.substring(0, 4), 10);
    var monthNumber = parseInt(rosetteDate.substring(5, 7), 10) - 1;
    var dayNumber = parseInt(rosetteDate.substring(8, 10), 10);
    return new Date(yearNumber, monthNumber, dayNumber);
}

function refToText(ref, refType) {
	if (ref != null) {
		if (Array.isArray(ref)) {
			// TODO: Handle multiple references
		} else {
			switch (refType) {
			    case 'user': return ref.fullName + " (" + ref.username + ")"; break;
			    case 'group': return ref.name; break;
				case 'location': return ref.name; break;
                case 'eventType': return ref.name; break;
                default: return ref.name; break;
			}
		}
	}
	return null;
}

function refOrTextToText(refOrText, refType) {
    if (refOrText != null) {
        if (Array.isArray(refOrText)) {
            // TODO: Handle multiple references
        } else {
            if (refOrText.ref != null) {
                return refToText(refOrText.ref);
            } else if (refOrText.text != null) {
                return refOrText.text;
            }
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

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString();
    var dd  = this.getDate().toString();
    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
};
