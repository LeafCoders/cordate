'use strict';

test("Parse bookings with parseVerticalTextByFormat()", function() {
    var bookingFormat = [
        { text : "Kund:",      value : "customerName" },
        { text : "Kundgrupp:", value : "customerGroup" },
        { text : "Starttid:",  value : "startDate" },
        { text : "Sluttid:",   value : "endDate" },
        { text : "Lokal:",     value : "location" }
    ];

    var bookingText = '' +
        'Kund:           Kund1\n' +
        'Kundgrupp:      Interna kunder\n' +
        'Starttid:       2014-02-04 14:00\n' +
        'Sluttid:        2014-02-04 16:00\n' +
        'Lokal:          Kyrksalen\n' +
        ' \n' +
        'Kunderror:      Kund2\n' +
        'Kundgrupp:      Interna kunder\n' +
        'Starttid:       2014-02-05 10:00\n' +
        'Sluttid:        2014-02-05 11:00\n' +
        'Lokal:          Linden/Aspen\n' +

        'Kund:           Kund3\n' +
        'Kundgrupp:      Interna kunder\n' +
        'Starttid:       2014-02-06 07:00\n' +
        'Sluttid:        2014-02-06 08:00\n' +
        'Lokal:          Kapellet';

    var objects = parseVerticalTextByFormat(bookingText, bookingFormat);

    ok(objects.success[0].customerName == "Kund1");
    ok(objects.success[0].customerGroup == "Interna kunder");
    ok(objects.success[0].location == "Kyrksalen");
    ok(objects.errors[0].row == 6);
    ok(objects.success[1].customerName == "Kund3");
    ok(objects.success[1].customerGroup == "Interna kunder");
    ok(objects.success[1].location == "Kapellet");
});
