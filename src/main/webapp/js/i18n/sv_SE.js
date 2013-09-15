'use strict';

angular.module('myApp.translation_sv_SE', []).
    value('translationMap', {
        "navbar.events" : "Händelser",
        "navbar.users" : "Användare",
        "navbar.groups" : "Grupper",
        "navbar.groupMemberships" : "Gruppmedlemskap",
        "navbar.permissions" : "Behörigheter",
        "navbar.logout" : "Logga ut",

        "January": "Januari",
        "February" : "Februari",
        "March" : "Mars",
        "April" : "April",
        "May" : "Maj",
        "June" : "Juni",
        "July" : "Juli",
        "August" : "Augusti",
        "September" : "September",
        "October" : "Oktober",
        "November" : "November",
        "December" : "December",

        "items.edit" : "Redigera",
        "items.delete" : "Radera",

        "item.edit" : "Redigera",
        "itemEditor.editTitle" : "",
        "itemEditor.newTitle" : "",
        "itemEditor.save" : "Spara",
        "itemEditor.cancel" : "Avbryt",
        "itemEditor.delete" : "Radera",

        "items.title.event" : "Händelser",
        "items.new.event" : "Ny händelse",
        "items.itemDeleteConfirmation.event" : "Vill du verkligen radera händelsen?",
        "items.itemDeleted.event" : "Händelsen raderades!",
        "items.eventweek.week" : "Vecka",
        "items.eventweek.today" : "Idag",
        "items.eventweek.Monday" : "Måndag",
        "items.eventweek.Tuesday" : "Tisdag",
        "items.eventweek.Wednesday" : "Onsdag",
        "items.eventweek.Thursday" : "Torsdag",
        "items.eventweek.Friday" : "Fredag",
        "items.eventweek.Saturday" : "Lördag",
        "items.eventweek.Sunday" : "Söndag",

        "itemEditor.newTitle.event" : "Ny händelse",
        "itemEditor.editTitle.event" : "Redigera händelse",
        "itemEditor.event.title" : "Titel",
        "itemEditor.event.startTime" : "Börjar",
        "itemEditor.event.endTime" : "Slutar",
        "itemEditor.event.description" : "Beskrivning",
        "itemEditor.itemCreated.event" : "Händelsen skapades!",
        "itemEditor.itemUpdated.event" : "Händelsen uppdaterades!",
        "itemEditor.itemDeleted.event" : "Händelsen raderades!",
        "itemEditor.itemDeleteConfirmation.event" : "Vill du verkligen radera händelsen?",
        "event.title.notNull" : "Titel saknas",
        "event.startTime.notNull" : "Starttid saknas",

        "items.title.user" : "Användare",
        "items.new.user" : "Ny användare",
        "items.itemDeleteConfirmation.user" : "Vill du verkligen radera användaren?",
        "items.itemDeleted.user" : "Användaren raderades!",
        "users.tableTitleUsername" : "Användarnamn",
        "users.tableTitleFirstName" : "Förnamn",
        "users.tableTitleLastName" : "Efternamn",

        "itemEditor.newTitle.user" : "Ny användare",
        "itemEditor.editTitle.user" : "Redigera användare",
        "itemEditor.username" : "Användarnamn",
        "itemEditor.firstName" : "Förnamn",
        "itemEditor.lastName" : "Efternamn",
        "itemEditor.password" : "Lösenord",
        "itemEditor.itemCreated.user" : "Användaren skapades!",
        "itemEditor.itemUpdated.user" : "Användaren uppdaterades!",
        "itemEditor.itemDeleted.user" : "Användaren raderades!",
        "itemEditor.itemDeleteConfirmation.user" : "Vill du verkligen radera användaren?",
        "user.username.notNull":"Användarnamn saknas",
        "user.username.duplicatedUsernameNotAllowed" : "Användarnamnet är upptaget",

        "items.title.group" : "Grupper",
        "items.new.group" : "Ny grupp",
        "items.itemDeleteConfirmation.group" : "Vill du verkligen radera gruppen?",
        "items.itemDeleted.group" : "Gruppen raderades!",

        "itemEditor.newTitle.group" : "Ny grupp",
        "itemEditor.editTitle.group" : "Redigera grupp",
        "itemEditor.name" : "Namn",
        "itemEditor.itemCreated.group" : "Gruppen skapades!",
        "itemEditor.itemUpdated.group" : "Gruppen uppdaterades!",
        "itemEditor.itemDeleted.group" : "Gruppen raderades!",
        "itemEditor.itemDeleteConfirmation.group" : "Vill du verkligen radera gruppen?",
        "group.name.notNull":"Namn saknas",

        "items.title.groupMembership" : "Gruppmedlemskap",
        "items.new.groupMembership" : "Nytt gruppmedlemskap",
        "items.itemDeleteConfirmation.groupMembership" : "Vill du verkligen radera gruppmedlemskapet?",
        "items.itemDeleted.groupMembership" : "Gruppmedlemskapet raderades!",
        "groupMemberships.tableTitleGroup" : "Grupp",
        "groupMemberships.tableTitleUser" : "Användare",

        "item.title.groupMembership" : "Gruppmedlemskap",

        "itemEditor.newTitle.groupMembership" : "Nytt gruppmedlemskap",
        "itemEditor.editTitle.groupMembership" : "Redigera gruppmedlemskap",
        "itemEditor.group" : "Grupp",
        "itemEditor.choseGroup" : "Välj grupp...",
        "itemEditor.user" : "Användare",
        "itemEditor.choseUser" : "Välj användare...",
        "itemEditor.itemCreated.groupMembership" : "Gruppmedlemskapet skapades!",
        "itemEditor.itemUpdated.groupMembership" : "Gruppmedlemskapet uppdaterades!",
        "itemEditor.itemDeleted.groupMembership" : "Gruppmedlemskapet raderades!",
        'itemEditor.itemDeleteConfirmation.groupMembership' : "Vill du verkligen radera gruppmedlemskapet?",
        "groupMembership.groupId.notNull" : "Grupp saknas",
        "groupMembership.userId.notNull" : "Användare saknas",

        "items.title.permission" : "Behörigheter",
        "items.new.permission" : "Ny behörighet",
        "items.itemDeleteConfirmation.permission" : "Vill du verkligen radera behörigheten?",
        "items.itemDeleted.permission" : "Behörigheten raderades!",
        "items.permissionsForEveryone" : "Alla",
        "items.permissionsForGroups" : "Grupper",
        "items.permissionsForUsers" : "Användare",
        "items.everyone" : "Alla",

        "item.permissionForEveryone" : "Alla",

        "itemEditor.newTitle.permission" : "Ny behörighet",
        "itemEditor.editTitle.permission" : "Redigera behörighet",
        "itemEditor.permissionType" : "Behörighetstyp",
        "itemEditor.itemCreated.permission" : "Behörigheten skapades!",
        "itemEditor.itemUpdated.permission" : "Behörigheten uppdaterades!",
        "itemEditor.itemDeleted.permission" : "Behörigheten raderades!",
        "itemEditor.itemDeleteConfirmation.permission" : "Vill du verkligen radera behörigheten?",
        "permission.groupId.notEmpty" : "Behörigheter saknas"
    })