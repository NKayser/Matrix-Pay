import { ServerResponse } from '../Response/ServerResponse';

export interface BasicDataInterface {
    // Erstelle eine neue Gruppe mit dem Name name und der Währung currency.
    groupCreate(name: string, currency: string): Promise<ServerResponse>;

    // Füge den Kontakt mit Id contactId zu der Gruppe mit Id groupId hinzu.
    groupAddMember(groupId: string, contactId: string): Promise<ServerResponse>;

    // Verlasse die Gruppe mit der Id groupId.
    leaveGroup(groupId: string): Promise<ServerResponse>;

    // Erstelle eine Transaktion mit den angegebenen Daten.
    createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[],
                      isPayback: boolean): Promise<ServerResponse>;

    // Setze die Daten des Payments mit der Id transactionId in der Gruppe mit Id groupId auf die angegebenen Daten.
    modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string,
                      recipientIds: string[], amounts: number[]) : Promise<ServerResponse>;

    // Ändere die Standardwährung des Benutzers zu currency.
    userChangeDefaultCurrency(currency: string): Promise<ServerResponse>;

    // Ändere die Benutzersprache zu language.
    userChangeLanguage(language: string): Promise<ServerResponse>;

    // Bestätige die vorgeschlagene Rückzahlung.
    // Änderung: es wird die recommendationId gebraucht, also der Index der Recommendation in der Recommendations Array
    confirmPayback(groupId: string, recommendationId: number) : Promise<ServerResponse>;

    // Lade die nächstälteren Transaktionen und Aktivitäten der Gruppe mit groupId, die seit dem letzten Login noch nicht abgefragt wurden und gib sie an den entsprechenden Observable.
    fetchHistory(groupId: string): Promise<ServerResponse>;
}
