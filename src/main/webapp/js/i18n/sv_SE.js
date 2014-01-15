'use strict';

angular.module('myApp.translation_sv_SE', []).
    value('translationMap', {
        "navbar.label.eventweek" : "Händelser",
        "navbar.label.events" : "Händelser",
        "navbar.label.posters" : "Affischer",
        "navbar.label.bookings" : "Bokningar",
        "navbar.label.admin" : "Admin",
        "navbar.label.users" : "Användare",
        "navbar.label.groups" : "Grupper",
        "navbar.label.groupMemberships" : "Gruppmedlemskap",
        "navbar.label.permissions" : "Behörigheter",
        "navbar.label.locations" : "Lokaler",
        "navbar.label.userResourceTypes" : "Resurser",
        "navbar.label.eventTypes" : "Händelsetyper",
        "navbar.label.logout" : "Logga ut",

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

        "items.action.edit" : "Redigera",
        "items.action.delete" : "Radera",

        "item.action.edit" : "Redigera",
        "item.action.delete" : "Radera",
        "item.action.cancel" : "Avbryt",

        "item.status.shallShow" : "Ska visas",
        "item.status.isShowing" : "Visas nu",
        "item.status.hasBeenShown" : "Har visats",

        "itemEditor.action.save" : "Spara",
        "itemEditor.action.cancel" : "Avbryt",

        "error.badRequest" : "Sorry, ogiltigt anrop",
        "error.permissionDenied" : "Behörighet saknas",
        "error.unknownError" : "Oops! Något gick snett. Försök igen.",
        "error.hasIdOrText.oneMustBeSet" : "Id eller text måste sättas.",

        "formLabel.startTime" : "Börjar",
        "formLabel.endTime" : "Slutar",
        "formLabel.customerName" : "Kund",
        "formLabel.location" : "Lokal",
        
        "modalTitle.location" : "Välj lokal",
        
        "eventItems.label.title" : "Händelser",
        "eventItems.label.week" : "Vecka",
        "eventItems.label.today" : "Idag",
        "eventItems.label.Monday" : "Måndag",
        "eventItems.label.Tuesday" : "Tisdag",
        "eventItems.label.Wednesday" : "Onsdag",
        "eventItems.label.Thursday" : "Torsdag",
        "eventItems.label.Friday" : "Fredag",
        "eventItems.label.Saturday" : "Lördag",
        "eventItems.label.Sunday" : "Söndag",
        "eventItems.action.new" : "Ny händelse",
        "eventItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera händelsen?",
        "eventItems.alert.itemWasDeleted" : "Händelsen raderades!",

        "eventItem.label.description" : "Beskrivning",
        "eventItem.label.startTime" : "Börjar",
        "eventItem.label.endTime" : "Slutar",
        "eventItem.label.eventType" : "Typ",
        "eventItem.label.location" : "Lokal",
        "eventItem.label.backToItems" : "« Tillbaka till händelser",

        "eventEditor.label.newTitle" : "Ny händelse",
        "eventEditor.label.editTitle" : "Redigera händelse",
        "eventEditor.formLabel.title" : "Titel",
        "eventEditor.formLabel.description" : "Beskrivning",
        "eventEditor.formLabel.startTime" : "Börjar",
        "eventEditor.formLabel.endTime" : "Slutar",
        "eventEditor.formLabel.eventType" : "Typ",
        "eventEditor.formLabel.chooseEventType" : "Välj...",
        "eventEditor.formLabel.location" : "Lokal",
        "eventEditor.formLabel.chooseLocation" : "Välj...",

        "eventEditor.formLabel.deleteUser" : "Ta bort",
        "eventEditor.formLabel.addUser" : "Lägg till...",
        "eventEditor.alert.itemWasCreated" : "Händelsen skapades!",
        "eventEditor.alert.itemWasUpdated" : "Händelsen uppdaterades!",
        "event.title.notEmpty" : "Titel saknas",
        "event.startTime.notNull" : "Starttid saknas",
        "event.startBeforeEndTime" : "Händelsen får inte sluta innan den har börjat",

        "userItems.label.title" : "Användare",
        "userItems.action.new" : "Ny användare",
        "userItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera användaren?",
        "userItems.alert.itemWasDeleted" : "Användaren raderades!",

        "userItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera användaren?",
        "userItem.alert.itemWasDeleted" : "Användaren raderades!",
        "userItem.label.backToItems" : "« Tillbaka till användare",

        "userEditor.label.newTitle" : "Ny användare",
        "userEditor.label.editTitle" : "Redigera användare",
        "userEditor.formLabel.username" : "Användarnamn",
        "userEditor.formLabel.firstName" : "Förnamn",
        "userEditor.formLabel.lastName" : "Efternamn",
        "userEditor.formLabel.password" : "Lösenord",
        "userEditor.formLabel.reenterPassword" : "Repetera lösenord",
        "userEditor.alert.itemWasCreated" : "Användaren skapades!",
        "userEditor.alert.itemWasUpdated" : "Användaren uppdaterades!",
        "userEditor.alert.passwordsNotMatching" : "Lösenorden matchar inte",
        "user.username.notEmpty":"Användarnamn saknas",
        "user.username.duplicatedUsernameNotAllowed" : "Användarnamnet är upptaget",

        "groupItems.label.title" : "Grupper",
        "groupItems.action.new" : "Ny grupp",
        "groupItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera gruppen?",
        "groupItems.alert.itemWasDeleted" : "Gruppen raderades!",

        "groupItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera gruppen?",
        "groupItem.alert.itemWasDeleted" : "Gruppen raderades!",
        "groupItem.label.backToItems" : "« Tillbaka till grupper",

        "groupEditor.label.newTitle" : "Ny grupp",
        "groupEditor.label.editTitle" : "Redigera grupp",
        "groupEditor.formLabel.name" : "Namn",
        "groupEditor.alert.itemWasCreated" : "Gruppen skapades!",
        "groupEditor.alert.itemWasUpdated" : "Gruppen uppdaterades!",
        "group.name.notNull":"Namn saknas",

        "groupMembershipItems.label.title" : "Gruppmedlemskap",
        "groupMembershipItems.action.new" : "Nytt gruppmedlemskap",
        "groupMembershipItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera gruppmedlemskapet?",
        "groupMembershipItems.alert.itemWasDeleted" : "Gruppmedlemskapet raderades!",
        "groupMembershipItems.label.tableTitleGroup" : "Grupp",
        "groupMembershipItems.label.tableTitleUser" : "Användare",

        "groupMembershipItem.label.title" : "Gruppmedlemskap",
        "groupMembershipItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera gruppmedlemskapet?",
        "groupMembershipItem.alert.itemWasDeleted" : "Gruppmedlemskapet raderades!",
        "groupMembershipItem.label.backToItems" : "« Tillbaka till gruppmedlemskap",

        "groupMembershipEditor.label.newTitle" : "Nytt gruppmedlemskap",
        "groupMembershipEditor.label.editTitle" : "Redigera gruppmedlemskap",
        "groupMembershipEditor.formLabel.group" : "Grupp",
        "groupMembershipEditor.formLabel.choseGroup" : "Välj grupp...",
        "groupMembershipEditor.formLabel.user" : "Användare",
        "groupMembershipEditor.formLabel.choseUser" : "Välj användare...",
        "groupMembershipEditor.alert.itemWasCreated" : "Gruppmedlemskapet skapades!",
        "groupMembershipEditor.alert.itemWasUpdated" : "Gruppmedlemskapet uppdaterades!",
        "groupMembership.groupId.notNull" : "Grupp saknas",
        "groupMembership.userId.notNull" : "Användare saknas",
        "groupMembership.alreadyExists" : "Gruppmedlemskapet finns redan",

        "permissionItems.label.title" : "Behörigheter",
        "permissionItems.action.new" : "Ny behörighet",
        "permissionItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera behörigheten?",
        "permissionItems.alert.itemWasDeleted" : "Behörigheten raderades!",
        "permissionItems.label.permissionsForEveryone" : "Alla",
        "permissionItems.label.permissionsForGroups" : "Grupper",
        "permissionItems.label.permissionsForUsers" : "Användare",
        "permissionItems.label.everyone" : "Alla",

        "permissionItem.label.permissionsForEveryone" : "Alla",
        "permissionItem.label.permissions" : "Behörigheter",
        "permissionItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera behörigheten?",
        "permissionItem.alert.itemWasDeleted" : "Behörigheten raderades!",
        "permissionItem.label.backToItems" : "« Tillbaka till behörigheter",

        "permissionEditor.label.newTitle" : "Ny behörighet",
        "permissionEditor.label.editTitle" : "Redigera behörighet",
        "permissionEditor.formLabel.permissionFor" : "Behörighet för",
        "permissionEditor.formLabel.everyone" : "Alla",
        "permissionEditor.formLabel.group" : "Grupp",
        "permissionEditor.formLabel.user" : "Användare",
        "permissionEditor.formLabel.choseGroup" : "Välj grupp...",
        "permissionEditor.formLabel.choseUser" : "Välj användare...",
        "permissionEditor.formLabel.patterns" : "Behörigheter",
        "permissionEditor.alert.itemWasCreated" : "Behörigheten skapades!",
        "permissionEditor.alert.itemWasUpdated" : "Behörigheten uppdaterades!",
        "permission.patterns.notEmpty" : "Behörigheter saknas",

        "locationItems.label.title" : "Lokaler",
        "locationItems.action.new" : "Ny lokal",
        "locationItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera lokalen?",
        "locationItems.alert.itemWasDeleted" : "Lokalen raderades!",

        "locationItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera lokalen?",
        "locationItem.alert.itemWasDeleted" : "Lokalen raderades!",
        "locationItem.label.backToItems" : "« Tillbaka till lokaler",

        "locationEditor.label.newTitle" : "Ny lokal",
        "locationEditor.label.editTitle" : "Redigera lokal",
        "locationEditor.formLabel.name" : "Namn",
        "locationEditor.formLabel.description" : "Beskrivning",
        "locationEditor.alert.itemWasCreated" : "Lokalen skapades!",
        "locationEditor.alert.itemWasUpdated" : "Lokalen uppdaterades!",
        "location.name.notNull":"Namn saknas",

        "userResourceTypeItems.label.title" : "Resurser",
        "userResourceTypeItems.action.new" : "Ny resurser",
        "userResourceTypeItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera resursen?",
        "userResourceTypeItems.alert.itemWasDeleted" : "Resursen raderades!",

        "userResourceTypeItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera resursen?",
        "userResourceTypeItem.alert.itemWasDeleted" : "Resursen raderades!",
        "userResourceTypeItem.label.backToItems" : "« Tillbaka till resurser",

        "userResourceTypeEditor.label.newTitle" : "Ny resurs",
        "userResourceTypeEditor.label.editTitle" : "Redigera resurs",
        "userResourceTypeEditor.formLabel.name" : "Namn",
        "userResourceTypeEditor.formLabel.group" : "Grupp",
        "userResourceTypeEditor.formLabel.sortOrder" : "Sorteringsordning",
        "userResourceTypeEditor.formLabel.choseGroup" : "Välj grupp...",
        "userResourceTypeEditor.alert.itemWasCreated" : "Resursen skapades!",
        "userResourceTypeEditor.alert.itemWasUpdated" : "Resursen uppdaterades!",
        "userResourceType.name.notEmpty" : "Namn saknas",

        "eventTypeItems.label.title" : "Händelsetyper",
        "eventTypeItems.action.new" : "Ny händelsetyp",
        "eventTypeItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera händelsetypen?",
        "eventTypeItems.alert.itemWasDeleted" : "Händelsetypen raderades!",

        "eventTypeItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera händelsetypen?",
        "eventTypeItem.alert.itemWasDeleted" : "Händelsetypen raderades!",
        "eventTypeItem.label.backToItems" : "« Tillbaka till händelsetyper",

        "eventTypeEditor.label.newTitle" : "Ny händelsetyp",
        "eventTypeEditor.label.editTitle" : "Redigera händelsetyp",
        "eventTypeEditor.formLabel.name" : "Namn",
        "eventTypeEditor.alert.itemWasCreated" : "Händelsetypen skapades!",
        "eventTypeEditor.alert.itemWasUpdated" : "Händelsetypen uppdaterades!",
        "eventType.name.notNull":"Namn saknas",

        "poster.title.notEmpty" : "Titel saknas.",
        "poster.startTime.notNull" : "Starttid saknas.",
        "poster.endTime.notNull" : "Sluttid saknas.",
        "poster.startBeforeEndTime" : "Starttiden måste vara före sluttiden.",
        "poster.duration.tooShort" : "Visningstiden är för kort.",

        "posterItems.label.title" : "Affischer",
        "posterItems.action.new" : "Ny affisch",
        "posterItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera affischen?",
        "posterItems.alert.itemWasDeleted" : "Affischen raderades!",

        "posterItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera affischen?",
        "posterItem.alert.itemWasDeleted" : "Affischen raderades!",
        "posterItem.label.backToItems" : "« Tillbaka till affischer",

        "posterEditor.label.newTitle" : "Ny affisch",
        "posterEditor.label.editTitle" : "Redigera affisch",
        "posterEditor.formLabel.title" : "Titel",
        "posterEditor.formLabel.startTime" : "Börjar",
        "posterEditor.formLabel.endTime" : "Slutar",
        "posterEditor.formLabel.duration" : "Visningstid",
        "posterEditor.alert.itemWasCreated" : "Affischen skapades!",
        "posterEditor.alert.itemWasUpdated" : "Affischen uppdaterades!",

        "booking" : "Bokning",
        "booking.startTime.notNull" : "Starttid saknas.",
        "booking.endTime.notNull" : "Sluttid saknas.",
        "booking.startBeforeEndTime" : "Starttiden måste vara före sluttiden.",
        "booking.customerName.notEmpty" : "Namn på kund saknas.",
        "booking.location.notNull" : "Lokal saknas.",

        "bookingItems.label.title" : "Bokningar",
        "bookingItems.action.new" : "Ny bokning",
        "bookingItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera bokningen?",
        "bookingItems.alert.itemWasDeleted" : "Bokningen raderades!",

        "bookingItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera bokningen?",
        "bookingItem.alert.itemWasDeleted" : "Bokningen raderades!",
        "bookingItem.label.backToItems" : "« Tillbaka till bokningar",

        "bookingEditor.label.newTitle" : "Ny bokning",
        "bookingEditor.label.editTitle" : "Redigera bokning",
        "bookingEditor.alert.itemWasCreated" : "Bokningen skapades!",
        "bookingEditor.alert.itemWasUpdated" : "Bokningen uppdaterades!"
    });
