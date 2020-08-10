import {Group} from './Group';
import {AtomarChange} from './AtomarChange';
import {Groupmember} from './Groupmember';
import {TransactionType} from './TransactionType';

/**
 * A transaction inside a group. Can bei either an expense or a payback.
 */
export class Transaction {
  private readonly _transactionType: TransactionType;
  private readonly _transactionId: string;
  private _name: string;
  private readonly _creationDate: Date;
  private readonly _group: Group;
  private _payer: AtomarChange;
  private _recipients: AtomarChange[];
  private readonly _sender: Groupmember;

  /**
   * Constructor for Transaction.
   * @param transactionType  Type of the transaction. Can be either PAYBACK or EXPENSE.
   * @param transactionId  ID of the transaction.
   * @param name  Name of the transaction
   * @param creationDate  Date when the transaction is created.
   * @param group  Group in which the transaction is.
   * @param payer  Payer of the transaction.
   * @param recipients  Array holding recipients of the transaction.
   * @param sender  Sender of the transaction. The sender is not necessarily the payer or recipient.
   */
  constructor(transactionType: TransactionType, transactionId: string, name: string, creationDate: Date, group: Group,
              payer: AtomarChange, recipients: AtomarChange[], sender: Groupmember) {
    this._transactionType = transactionType;
    this._transactionId = transactionId;
    this._name = name;
    this._creationDate = creationDate;
    this._group = group;
    this._payer = payer;
    this._recipients = recipients;
    this._sender = sender;
  }

  /**
   * Returns the type of the transaction.
   */
  get transactionType(): TransactionType {
    return this._transactionType;
  }

  /**
   * Returns the ID of the transaction.
   */
  get transactionId(): string {
    return this._transactionId;
  }

  /**
   * Returns the name of the transaction.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Sets the name for the transaction.
   * @param value  New name.
   */
  set name(value: string) {
    this._name = value;
  }

  /**
   * Returns the date when the transaction was created.
   */
  get creationDate(): Date {
    return this._creationDate;
  }

  /**
   * Returns the group of the transaction.
   */
  get group(): Group {
    return this._group;
  }

  /**
   * Returns the payer of the transaction.
   */
  get payer(): AtomarChange {
    return this._payer;
  }

  /**
   * Sets the payer for the transaction.
   * @param value  New payer.
   */
  set payer(value: AtomarChange) {
    this._payer = value;
  }

  /**
   * Returns an array holding the recipients of the transaction.
   */
  get recipients(): AtomarChange[] {
    return this._recipients;
  }

  /**
   * Sets the recipients for the transaction.
   * @param value  New array with recipients.
   */
  set recipients(value: AtomarChange[]) {
    this._recipients = value;
  }

  /**
   * Returns the sender of the transaction.
   */
  get sender(): Groupmember {
    return this._sender;
  }
}
