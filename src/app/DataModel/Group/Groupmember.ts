import {Contact} from './Contact';
import {Group} from './Group';

/**
 * Groupmember in a group. A Groupmember is a contact with a specific balance inside a specific group.
 */
export class Groupmember {
  private readonly _contact: Contact;
  private readonly _group: Group;
  private _balance: number;

  /**
   * Constructor for groupmember. In addition to setting the values given by the arguments, balance is initialized as zero.
   * @param contact  Contact of the groupmember.
   * @param group  Group in which the groupmember is.
   */
  public constructor(contact: Contact, group: Group) {
    this._contact = contact;
    this._group = group;
    this._balance = 0;
  }

  /**
   * Returns the contact of the groupmember.
   */
  get contact(): Contact {
    return this._contact;
  }

  /**
   * Returns the group of the groupmember.
   */
  get group(): Group {
    return this._group;
  }

  /**
   * Returns the balance of the groupmember.
   */
  get balance(): number {
    return this._balance;
  }

  /**
   * Sets the balance of the groupmember.
   * @param value  New balance.
   */
  set balance(value: number) {
    this._balance = value;
  }
}
