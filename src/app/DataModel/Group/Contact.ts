/**
 * Contact of a person in a group of the application. The contact object doesn't sepcify the group it is in or the balance.
 * For that, see Groupmember.
 */
export class Contact {
  private _contactId: string;
  private _name: string;

  /**
   * Constructor for Contact.
   * @param contactId  ID of the contact.
   * @param name  Name of the contact.
   */
  public constructor(contactId: string, name: string) {
    this._contactId = contactId;
    this._name = name;
  }

  /**
   * Returns the ID of the contact.
   */
  get contactId(): string {
    return this._contactId;
  }

  /**
   * Sets the ID for the contact.
   * @param value  New ID for the contact.
   */
  set contactId(value: string) {
    this._contactId = value;
  }

  /**
   * Returns the name of the contact.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Sets the name for the contact.
   * @param value  New name for the contact.
   */
  set name(value: string) {
    this._name = value;
  }
}
