export class Messages {

  public static ERROR_SYNTAX: string = 'error.syntax';
  public static ERROR_FORBIDDEN: string = 'error.forbidden';
  public static ERROR_UNKNOWN: string = 'error.unknown';

  public static REASON_SERVER_UNREACHABLE: string = 'reason.serverUnreachable';
  public static REASON_UNKNOWN: string = 'reason.unknown';

  public static AUTH_INVALID_PASSWORD: string = 'auth.invalidPassword';

  private static messages: { [langCode: string]: string } = {
    [Messages.AUTH_INVALID_PASSWORD]: 'Felaktigt lösenord',
    'auth.userNotActivated': 'Användaren har inte aktiverats än',

    [Messages.REASON_SERVER_UNREACHABLE]: 'Servern kan inte nås för tillfället',
    [Messages.REASON_UNKNOWN]: 'Okänd anledning',
    'reason.missingPermission': 'Du saknar rättighet till detta',
    'reason.childAlreadyExist': 'Objektet är redan tillaggt',
    'reason.childDontBelongTo': 'Objektet kan inte läggas till',
    'reason.create.alreadyExist': 'Ett objekt med samma id eller namn finns redan',

    [Messages.ERROR_SYNTAX]: 'Fel i programmet, kontakta utvecklaren',
    [Messages.ERROR_FORBIDDEN]: 'Ogiltigt anrop, kontakta utvecklaren',
    'error.notFound': 'Hittades inte, ladda om sidan',
    'error.notNull': 'Måste anges',
    [Messages.ERROR_UNKNOWN]: 'Okänt fel, ladda om sidan',

    'error.string.notEmpty': 'Får inte vara tomt',
    'error.string.max32Chars': 'Får max innehålla 32 tecken',
    'error.string.max200Chars': 'Får max innehålla 200 tecken',
    'error.string.max4000Chars': 'Får max innehålla 4000 tecken',
    'error.string.max10000Chars': 'Får max innehålla 10000 tecken',
    'error.string.notAnyOf': 'Måste vara en av dem i listan',

    'error.number.outOfRange': 'Värdet är för stort eller för litet',

    'error.email.invalid': 'Ogiltig e-postadress',
    'error.email.notUnique': 'E-postadressen används redan',

    'error.filename.invalid': 'Ogiltigt filnamn',
    'error.filename.notUnique': 'En fil med samma filnamn finns redan',

    'error.file.exceedSize': 'Filen är för stor',
    'error.file.notReadable': 'Filen kunder inte läsas',
    'error.file.invalidContent': 'Filen har ogiltigt innehåll',
    'error.file.invalidDimension': 'Filens bredd och höjd kunde inte läsas',
    'error.file.mimeTypeNotAllowed': 'Filtypen är inte tillåten',

    'error.idAlias.invalidFormat': 'Id-alias måste vara på formatet [a-z][a-zA-Z0-9]+',

    'error.permssions.invalid': 'Rättigheten har felaktigt format',

    'error.duration.tooShort': 'Tiden är för kort',

    'error.date.mustBeAfter': 'Datumet måste vara senare',
    'error.dateTime.mustBeAfter': 'Tidpunkten måste vara senare',

    'property.articleSerieId': 'Artikelserie-id',
    'property.articleTypeId': 'Artikeltyp-id',
    'property.authorName': 'Namn på författare',
    'property.content': 'Innehåll',
    'property.copyright': 'Copyright',
    'property.description': 'Beskrivning',
    'property.duration': 'Visningstid',
    'property.email': 'E-postadress',
    'property.endTime': 'Sluttid',
    'property.file': 'Fil',
    'property.fileName': 'Filnamn',
    'property.firstName': 'Förnamn',
    'property.id': 'Id',
    'property.idAlias': 'Id-alias',
    'property.imageId': 'Bild',
    'property.lastName': 'Efternamn',
    'property.language': 'Språk',
    'property.link': 'Länk',
    'property.mainCategory': 'Kategori',
    'property.name': 'Namn',
    'property.password': 'Lösenord',
    'property.startTime': 'Starttid',
    'property.subCategory': 'Underkategori',
    'property.subTitle': 'Undertitel',
    'property.title': 'Titel',
    'property.uploading': 'Uppladdning',
  };

  static get(langCode: string): string {
    if (!langCode) {
      return Messages.get('error.unknown');
    }
    const message: string = Messages.messages[langCode];
    return message ? message : `#${langCode}#`;
  }

  static getProperty(propertyName: string): string {
    return Messages.get(`property.${propertyName}`);
  }
}
