'use strict';

/* Utils */

function stringToTime(rosetteDate) {
    var yearNumber = parseInt(rosetteDate.substring(0, 4), 10);
    var monthNumber = parseInt(rosetteDate.substring(5, 7), 10) - 1;
    var dayNumber = parseInt(rosetteDate.substring(8, 10), 10);
    var hour = parseInt(rosetteDate.substring(11, 13), 10);
    var minute = parseInt(rosetteDate.substring(14, 16), 10);
    return new Date(yearNumber, monthNumber, dayNumber, hour, minute);
}

function refToText(ref, refType) {
	if (ref != null) {
		if (Array.isArray(ref)) {
			// TODO: Handle multiple references
		} else {
			switch (refType) {
			    case 'user': return ref.fullName; break;
			    case 'group': return ref.name; break;
				case 'location': return ref.name; break;
                case 'event': return ref.startTime.substr(0, 10) + ' - ' + ref.title; break;
                case 'eventType': return ref.name; break;
                case 'resourceType': return ref.name; break;
                case 'educationType': return ref.name; break;
                case 'educationTheme': return ref.title; break;
                case 'upload': return ref.fileName; break;
                case 'uploadFolder': return ref.name; break;
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
                return refToText(refOrText.ref, refType);
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

    var parseRowValue = function(expectedType, row) {
        if (row != null && row.trim().indexOf(expectedType) == 0) {
            return row.substr(expectedType.length).trim();
        }
        return null;
    };

    var rowsToFormat = function(rows, format, startRowIndex, numRows) {
        var data = { items: {}, numItems: 0, errors: [] };
        angular.forEach(format, function(formatItem) {
            var currentRow = startRowIndex + data.numItems;
            if (currentRow < numRows) {
                var value = parseRowValue(formatItem.text, rows[currentRow]);
                data.items[formatItem.value] = value;
    
                if (value != null) {
                    if (formatItem.inList && formatItem.inList.indexOf(value) < 0) {
                        data.errors.push({ row: currentRow, errorText: '\"' + value + '\" != ' + formatItem.inList.join(', ') });
                    }
                    if (formatItem.dataType == 'time') {
                        if (/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/.test(value) == false) {
                            data.errors.push({ row: currentRow, errorText: '\"' + value + '\" != YYYY-MM-DD HH:MM' });
                        }
                    }

                    data.numItems++;
                } else if (!formatItem.optional) {
                    data.errors.push({ row: currentRow, errorText: rows[currentRow].replace(/\t/g, ' ') });
                }
            } else if (!formatItem.optional) {
                data.errors.push({ row: currentRow, errorText: formatItem.text });
            }
        });
        return data;
    };

    // Split by \n or ;;
    var rows = text.split(/[(;)\2\n]+/g);
    var dataList = { success: [], errors : [] };
    var startText = format[0].text, numRows = rows.length, i;
    for (i = 0; i < numRows; i++) {
        if (rows[i].trim().indexOf(startText) >= 0) {
            // Read data from rows
            var data = rowsToFormat(rows, format, i, numRows);

            if (data.errors.length > 0) {
                dataList.errors.push.apply(dataList.errors, data.errors);
            } else if (data.numItems > 0) {
                dataList.success.push(data.items);
            }
            i += data.numItems - 1;
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
