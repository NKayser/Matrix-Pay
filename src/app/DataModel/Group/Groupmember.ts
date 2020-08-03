import {Contact} from "./Contact";
import {Group} from "./Group";

export class Groupmember {
  private readonly _contact: Contact; //readonly instead of const
  private readonly _group: Group; //readonly instead of const
  private _balance: number;

  public constructor(contact: Contact, group: Group) {
    this._contact = contact;
    this._group = group;
  }

  get contact(): Contact {
    return this._contact;
  }

  get group(): Group {
    return this._group;
  }

  get balance(): number {
    return this._balance;
  }

  set balance(value: number) {
    this._balance = value;
  }
}
