import {Group} from './Group';
import {AtomarChange} from './AtomarChange';
import {Groupmember} from './Groupmember';
import {TransactionType} from './TransactionType';

export class Transaction {
  private readonly _transactionType: TransactionType;
  private readonly _transactionId: string;
  private _name: string;
  private readonly _creationDate: Date;
  private readonly _group: Group;
  private _payer: AtomarChange;
  private _recipients: AtomarChange[];
  private readonly _sender: Groupmember;

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

  get transactionType(): TransactionType {
    return this._transactionType;
  }

  get transactionId(): string {
    return this._transactionId;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get creationDate(): Date {
    return this._creationDate;
  }

  get group(): Group {
    return this._group;
  }

  get payer(): AtomarChange {
    return this._payer;
  }

  set payer(value: AtomarChange) {
    this._payer = value;
  }

  get recipients(): AtomarChange[] {
    return this._recipients;
  }

  set recipients(value: AtomarChange[]) {
    this._recipients = value;
  }

  get sender(): Groupmember {
    return this._sender;
  }
}
