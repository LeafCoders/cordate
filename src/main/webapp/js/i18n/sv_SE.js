'use strict';

angular.module('myApp.translation_sv_SE', []).
    value('translationMap', {
        "navbar.label.eventweek" : "Händelser",
        "navbar.label.events" : "Händelser",
        "navbar.label.posters" : "Affischer",
        "navbar.label.admin" : "Admin",
        "navbar.label.users" : "Användare",
        "navbar.label.groups" : "Grupper",
        "navbar.label.groupMemberships" : "Gruppmedlemskap",
        "navbar.label.permissions" : "Behörigheter",
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

        "eventItem.label.backToItems" : "« Tillbaka till händelser",

        "eventEditor.label.newTitle" : "Ny händelse",
        "eventEditor.label.editTitle" : "Redigera händelse",
        "eventEditor.formLabel.title" : "Titel",
        "eventEditor.formLabel.startTime" : "Börjar",
        "eventEditor.formLabel.endTime" : "Slutar",
        "eventEditor.formLabel.description" : "Beskrivning",
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
        "posterEditor.alert.itemWasUpdated" : "Affischen uppdaterades!"
    })