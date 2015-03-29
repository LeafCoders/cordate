'use strict';

angular.module('myApp.translation_sv_SE', []).
    value('translationMap', {
        "navbar.label.eventWeek" : "Händelser",
        "navbar.label.events" : "Händelser",
        "navbar.label.posters" : "Affischer",
        "navbar.label.bookings" : "Bokningar",
        "navbar.label.uploads" : "Filer",
        "navbar.label.admin" : "Admin",
        "navbar.label.signupUsers" : "Användarförfrågningar",
        "navbar.label.users" : "Användare",
        "navbar.label.groups" : "Grupper",
        "navbar.label.groupMemberships" : "Gruppmedlemskap",
        "navbar.label.permissions" : "Behörigheter",
        "navbar.label.locations" : "Lokaler",
        "navbar.label.resourceTypes" : "Resurser",
        "navbar.label.eventTypes" : "Händelsetyper",
        "navbar.label.uploadFolders" : "Filkataloger",
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

        "yes" : "Ja",
        "no" : "Nej",
        
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
        "itemEditor.action.delete" : "Radera",
        "itemEditor.action.prev" : "Föregående",
        "itemEditor.action.next" : "Nästa",
        "itemEditor.action.select" : "Välj",
        "itemEditor.action.assign" : "Tilldela",
        "itemEditor.action.ok" : "Ok",
        "itemEditor.action.import" : "Importera",
        "itemEditor.action.addResource" : "Lägg till resurs",

        "error.badRequest" : "Sorry, ogiltigt anrop.",
        "error.missingPermission" : "Behörighet \"{{P0}}\" saknas.",
        "error.notFound" : "Resursen kunde inte hittas.",
        "error.forbidden" : "Ej tillåtet.",
        "error.referencedBy" : "Används av \"{{P0}}\".",
        "error.unknownError" : "Oops! Något gick snett. Försök igen eller kontakta webbansvarig.",
        "error.hasIdOrText.oneMustBeSet" : "Id eller text måste sättas.",
        "error.id.mustBeUnique" : "Ej unikt id! Id som du angett finns redan.",
        "error.id.notValidFormat" : "Fel format! Id måste börja med liten bokstav och får bara innehålla a-z, A-Z och 0-9.",

        "formLabel.id" : "Id",
        "formLabel.startTime" : "Börjar",
        "formLabel.endTime" : "Slutar",
        "formLabel.title" : "Titel",
        "formLabel.name" : "Namn",
        "formLabel.description" : "Beskrivning",
        "formLabel.customerGroup" : "Kundgrupp",
        "formLabel.customerName" : "Kund",
        "formLabel.location" : "Lokal",
        "formLabel.duration" : "Visningstid",
        "formLabel.firstName" : "Förnamn",
        "formLabel.lastName" : "Efternamn",
        "formLabel.password" : "Lösenord",
        "formLabel.reenterPassword" : "Repetera lösenord",
        "formLabel.email" : "E-post",
        "formLabel.type" : "Typ",
        "formLabel.key" : "Nyckelvärde",
        "formLabel.section" : "Sektion",
        "formLabel.eventType" : "Händelsetyp",
        "formLabel.image" : "Bild",
        "formLabel.user" : "Användare",
        "formLabel.group" : "Grupp",
        "formLabel.content" : "Innehåll",
        "formLabel.folder" : "Katalog",
        "formLabel.uploadFolder" : "Filkatalog",
        "formLabel.file" : "Fil",
        "formLabel.fileName" : "Filnamn",
        "formLabel.fileSize" : "Filstorlek",
        "formLabel.fileUrl" : "Länk",
        "formLabel.mimeType" : "Filtyp",
        "formLabel.mimeTypes" : "Filtyper",
        "formLabel.width" : "Bredd",
        "formLabel.height" : "Höjd",
        "formLabel.permissionFor" : "Behörighet för",
        "formLabel.permissions" : "Rättigheter",
        "formLabel.patterns" : "Behörigheter",
        "formLabel.multiSelect" : "Flerval",
        "formLabel.allowText" : "Tillåt text",
        "formLabel.showOnPalmate" : "Visa på hemsidan",
        "formLabel.createdTime" : "Skapad",
        "formLabel.orderBy" : "Ordna efter",
        "formLabel.isPublic" : "Publik",
        
        "modalLabel.user" : "Välj person",
        "modalLabel.group" : "Välj grupp",
        "modalLabel.location" : "Välj lokal",
        "modalLabel.image" : "Välj bild",
        "modalLabel.userResource" : "Välj person",
        "modalLabel.uploadResource" : "Välj fil",
        
        "event" : "Händelse",
        "eventItems.label.title" : "Händelser",
        "eventItems.label.week" : "Vecka",
        "eventItems.label.semester" : "Termin",
        "eventItems.label.today" : "Idag",
        "eventItems.label.Monday" : "Måndag",
        "eventItems.label.Tuesday" : "Tisdag",
        "eventItems.label.Wednesday" : "Onsdag",
        "eventItems.label.Thursday" : "Torsdag",
        "eventItems.label.Friday" : "Fredag",
        "eventItems.label.Saturday" : "Lördag",
        "eventItems.label.Sunday" : "Söndag",
        "eventItems.action.new" : "Ny händelse",
        "eventItems.action.import" : "Importera",
        "eventItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera händelsen?",
        "eventItems.alert.itemWasDeleted" : "Händelsen raderades!",

        "eventItem.label.description" : "Beskrivning",
        "eventItem.label.startTime" : "Börjar",
        "eventItem.label.endTime" : "Slutar",
        "eventItem.label.eventType" : "Typ",
        "eventItem.label.location" : "Lokal",
        "eventItem.label.image" : "Bild",
        "eventItem.label.backToItems" : "« Tillbaka till händelser",

        "eventEditor.label.newTitle" : "Ny händelse",
        "eventEditor.label.editTitle" : "Redigera händelse",
        "eventEditor.formLabel.title" : "Titel",
        "eventEditor.formLabel.description" : "Beskrivning",
        "eventEditor.formLabel.startTime" : "Börjar",
        "eventEditor.formLabel.endTime" : "Slutar",
        "eventEditor.formLabel.eventType" : "Typ",

        "eventEditor.alert.itemWasCreated" : "Händelsen skapades!",
        "eventEditor.alert.itemWasUpdated" : "Händelsen uppdaterades!",
        "event.title.notEmpty" : "Titel saknas",
        "event.startTime.notNull" : "Starttid saknas",
        "event.startBeforeEndTime" : "Händelsen får inte sluta innan den har börjat",

        "event.modalTitle.create" : "Välj händelsetyp",

        "eventImport.label.title" : "Importera händelser",
        "eventImport.content.invalid" : "Texten innehåller fel eller är felaktigt formaterad på följande rader:",
        "eventImport.content.foundCount" : "{{count}} händelser hittades i texten.",
        "eventImport.content.foundItems" : "Dessa händelser hittades i texten och kommer att importeras.",
        "eventImport.alert.numItemsImported" : "{{count}} av {{total}} händelser importerades!",
        "eventImport.alert.numItemsFailed" : "{{count}} av {{total}} händelser kunde inte importeras! Händelsen har titel och starttid: {{titles}}",
        "eventImport.progress.importing" : "Importerar händelser...",

        "signupUser" : "Användarförfrågan",
        "signupUserItems.label.title" : "Användarförfrågningar",
        "signupUserItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera användarförfrågan?",
        "signupUserItems.alert.itemWasDeleted" : "Användarförfrågan raderades!",

        "signupUserItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera användarförfrågan?",
        "signupUserItem.alert.itemWasDeleted" : "Användarförfrågan raderades!",
        "signupUserItem.label.backToItems" : "« Tillbaka till användarförfrågningar",
        "signupUserItems.action.transform" : "Omvandla till användare",

        "signupUserEditor.label.editTitle" : "Redigera användarförfrågan",
        "signupUserEditor.alert.itemWasUpdated" : "Användarförfrågan uppdaterades!",

        "user" : "Användare",
        "userItems.label.title" : "Användare",
        "userItems.action.new" : "Ny användare",
        "userItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera användaren?",
        "userItems.alert.itemWasDeleted" : "Användaren raderades!",

        "userItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera användaren?",
        "userItem.alert.itemWasDeleted" : "Användaren raderades!",
        "userItem.label.backToItems" : "« Tillbaka till användare",

        "userEditor.label.newTitle" : "Ny användare",
        "userEditor.label.editTitle" : "Redigera användare",
        "userEditor.alert.itemWasCreated" : "Användaren skapades!",
        "userEditor.alert.itemWasUpdated" : "Användaren uppdaterades!",
        "userEditor.alert.passwordsNotMatching" : "Lösenorden matchar inte",
        "user.email.mustBeUnique" : "E-postadressen används redan",
        "user.email.notEmpty" : "E-postadress saknas",
        "user.email.invalid" : "E-postadressen är felaktig",
        "user.firstName.notEmpty" : "Förnamn saknas",
        "user.lastName.notEmpty" : "Efternamn saknas",

        "group" : "Grupp",
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

        "groupMembership" : "Gruppmedlemskap",
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

        "permission" : "Behörighet",
        "permissionItems.label.title" : "Behörigheter",
        "permissionItems.action.new" : "Ny behörighet",
        "permissionItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera behörigheten?",
        "permissionItems.alert.itemWasDeleted" : "Behörigheten raderades!",
        "permissionItems.label.permissionsForEveryone" : "Alla",
        "permissionItems.label.permissionsForGroups" : "Grupper",
        "permissionItems.label.permissionsForUsers" : "Användare",
        "permissionItems.label.everyone" : "Alla",

        "permissionItem.label.permissionsForEveryone" : "Behärigheter för alla",
        "permissionItem.label.permissions" : "Behörigheter",
        "permissionItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera behörigheten?",
        "permissionItem.alert.itemWasDeleted" : "Behörigheten raderades!",
        "permissionItem.label.backToItems" : "« Tillbaka till behörigheter",

        "permissionEditor.label.newTitle" : "Ny behörighet",
        "permissionEditor.label.editTitle" : "Redigera behörighet",
        "permissionEditor.formLabel.everyone" : "Alla",
        "permissionEditor.formLabel.group" : "Grupp",
        "permissionEditor.formLabel.user" : "Användare",
        "permissionEditor.formLabel.choseGroup" : "Välj grupp...",
        "permissionEditor.formLabel.choseUser" : "Välj användare...",
        "permissionEditor.alert.itemWasCreated" : "Behörigheten skapades!",
        "permissionEditor.alert.itemWasUpdated" : "Behörigheten uppdaterades!",
        "permission.patterns.notEmpty" : "Behörigheter saknas",

        "location" : "Lokal",
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

        "resourceType" : "Resurs",
        "resourceTypeItems.label.title" : "Resurser",
        "resourceTypeItems.action.new" : "Ny resurs",
        "resourceTypeItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera resursen?",
        "resourceTypeItems.alert.itemWasDeleted" : "Resursen raderades!",

        "resourceTypeItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera resursen?",
        "resourceTypeItem.alert.itemWasDeleted" : "Resursen raderades!",
        "resourceTypeItem.label.backToItems" : "« Tillbaka till resurser",

        "resourceTypeEditor.label.newTitle" : "Ny resurs",
        "resourceTypeEditor.label.editTitle" : "Redigera resurs",
        "resourceTypeEditor.formLabel.name" : "Namn",
        "resourceTypeEditor.formLabel.group" : "Grupp",
        "resourceTypeEditor.formLabel.sortOrder" : "Sorteringsordning",
        "resourceTypeEditor.formLabel.choseGroup" : "Välj grupp...",
        "resourceTypeEditor.alert.itemWasCreated" : "Resursen skapades!",
        "resourceTypeEditor.alert.itemWasUpdated" : "Resursen uppdaterades!",
        "resourceType.name.notEmpty" : "Namn saknas",

        "resourceType.modalTitle.create" : "Välj resurstyp",
        "resourceType.type.user" : "Användare från grupp",
        "resourceType.type.upload" : "Fil från katalog",
        
        "eventType" : "Händelsetyp",
        "eventTypeItems.label.title" : "Händelsetyper",
        "eventTypeItems.action.new" : "Ny händelsetyp",
        "eventTypeItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera händelsetypen?",
        "eventTypeItems.alert.itemWasDeleted" : "Händelsetypen raderades!",

        "eventTypeItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera händelsetypen?",
        "eventTypeItem.alert.itemWasDeleted" : "Händelsetypen raderades!",
        "eventTypeItem.label.backToItems" : "« Tillbaka till händelsetyper",

        "eventTypeEditor.label.newTitle" : "Ny händelsetyp",
        "eventTypeEditor.label.editTitle" : "Redigera händelsetyp",
        "eventTypeEditor.label.selectedResourceTypes" : "Valda resurstyper",
        "eventTypeEditor.label.availableResourceTypes" : "Tillgängliga resurstyper",
        "eventTypeEditor.formLabel.name" : "Namn",
        "eventTypeEditor.alert.itemWasCreated" : "Händelsetypen skapades!",
        "eventTypeEditor.alert.itemWasUpdated" : "Händelsetypen uppdaterades!",
        "eventType.name.notNull":"Namn saknas",

        "poster" : "Affisch",
        "poster.title.notEmpty" : "Titel saknas.",
        "poster.startTime.notNull" : "Starttid saknas.",
        "poster.endTime.notNull" : "Sluttid saknas.",
        "poster.startBeforeEndTime" : "Starttiden måste vara före sluttiden.",
        "poster.duration.tooShort" : "Visningstiden är för kort.",
        "poster.image.mustBeSet" : "En bild måste anges",

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
        "bookingItems.action.import" : "Importera",
        "bookingItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera bokningen?",
        "bookingItems.alert.itemWasDeleted" : "Bokningen raderades!",

        "bookingItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera bokningen?",
        "bookingItem.alert.itemWasDeleted" : "Bokningen raderades!",
        "bookingItem.label.backToItems" : "« Tillbaka till bokningar",

        "bookingEditor.label.newTitle" : "Ny bokning",
        "bookingEditor.label.editTitle" : "Redigera bokning",
        "bookingEditor.alert.itemWasCreated" : "Bokningen skapades!",
        "bookingEditor.alert.itemWasUpdated" : "Bokningen uppdaterades!",

        "bookingImport.label.title" : "Importera bokningar",
        "bookingImport.content.invalid" : "Texten innehåller fel eller är felaktigt formaterad på följande rader:",
        "bookingImport.content.foundCount" : "{{count}} bokningar hittades i texten.",
        "bookingImport.content.selectItems" : "Välj bokningar och lokaler som ska importeras. Avmarkera samtliga ut en kundgrupp via knapparna nedan.",
        "bookingImport.alert.numItemsImported" : "{{count}} av {{total}} bokningar importerades!",
        "bookingImport.alert.numItemsFailed" : "{{count}} av {{total}} bokningar kunde inte importeras! Bokningarna har kundnamn och starttid: {{customers}}",
        "bookingImport.alert.deleteAllFailed" : "Kunde inte radera alla existerande bokningar före importen! Importen avbröts.",
        "bookingImport.prompt.deleteAllConfirmation" : "Vill du radera alla existerande bokningar innan importen startas?",
        "bookingImport.progress.importing" : "Importerar bokningar...",

        "uploadFolder" : "Filkatalog",
        "uploadFolder.mimeTypes.notEmpty" : "Filtyper saknas.",

        "uploadFolderItems.label.title" : "Filkataloger",
        "uploadFolderItems.action.new" : "Ny katalog",
        "uploadFolderItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera katalogen?",
        "uploadFolderItems.alert.itemWasDeleted" : "Katalogen raderades!",

        "uploadFolderItem.label.mimeTypes" : "Filtyper",
        "uploadFolderItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera katalogen?",
        "uploadFolderItem.alert.itemWasDeleted" : "Katalogen raderades!",
        "uploadFolderItem.label.backToItems" : "« Tillbaka till filkataloger",

        "uploadFolderEditor.label.newTitle" : "Ny katalog",
        "uploadFolderEditor.label.editTitle" : "Redigera katalog",
        "uploadFolderEditor.alert.itemWasCreated" : "Katalogen skapades!",
        "uploadFolderEditor.alert.itemWasUpdated" : "Katalogen updaterades!",

        "uploadFolder.posters" : "Affischer",
        "uploadFolder.locations" : "Lokaler",

        "upload" : "Fil",
        "upload.fileName.notNull" : "Filnamn saknas.",
        "upload.mimeType.notNull" : "Filtyp saknas.",
        "upload.mimeType.notAllowed" : "Filtypen är inte tillåten.",
        "upload.fileData.notNull" : "Filen saknar data.",
        "upload.alreadyExists" : "Det finns redan en fil med samma filnamn. Ändra namnet på filen du vill skapa och försök att ladda upp den igen.",
        "upload.invalidFileContent" : "Filens innehåll kunde inte läsas.",
        "upload.image.invalidSize" : "Bredd och höjd kunde inte läsas från bilden.",
        "upload.fileReader.notSupported" : "Din webbläsare kan inte användas för att ladda upp filer här.",

        "uploadItems.label.title" : "Filer",
        "uploadItems.action.new" : "Ny fil",
        "uploadItems.prompt.itemDeleteConfirmation" : "Vill du verkligen radera filen?",
        "uploadItems.alert.itemWasDeleted" : "Filen raderades!",
        "uploadItems.noFolderToShow" : "Det finns ingen katalog med filer att visa.",

        "uploadItem.prompt.itemDeleteConfirmation" : "Vill du verkligen radera filen?",
        "uploadItem.alert.itemWasDeleted" : "Filen raderades!",
        "uploadItem.label.backToItems" : "« Tillbaka till filer",

        "uploadEditor.label.newTitle" : "Ny fil",
        "uploadEditor.label.editTitle" : "Redigera fil",
        "uploadEditor.alert.itemWasCreated" : "Filen skapades!"
    });
