export class Contact {
  private readonly _contactId: string;
  private _name: string;

  public constructor(contactId: string, name: string) {
    this._contactId = contactId;
    this._name = name;
  }

  get contactId(): string {
    return this._contactId;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
