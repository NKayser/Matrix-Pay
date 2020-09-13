import {Contact} from './Contact';

/**
 * Single change in a contacts balance resulting from a transaction.
 */
export class AtomarChange {
  private readonly _contact: Contact;
  private readonly _amount: number;

  /**
   * constructor for AtomarChange
   * @param contact  Contact of the groupMember who's balance is to be changed.
   * @param amount  Amount by which the balance is to be changed.
   */
  public constructor(contact: Contact, amount: number) {
    this._contact = contact;
    this._amount = amount;
  }

  /**
   * Returns the contact of the groupMember who's balance is to be changed.
   */
  get contact(): Contact {
    return this._contact;
  }

  /**
   * Returns the amount by which the balance is to be changed.
   */
  get amount(): number {
    return this._amount;
  }
}
