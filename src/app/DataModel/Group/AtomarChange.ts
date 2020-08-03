import {Contact} from "./Contact";

export class AtomarChange {
  private readonly _contact: Contact;
  private readonly _amount: number;

  public constructor(contact: Contact, amount: number) {
    this._contact = contact;
    this._amount = amount;
  }

  get contact(): Contact {
    return this._contact;
  }

  get amount(): number {
    return this._amount;
  }
}
