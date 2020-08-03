import {Currency} from '../Utils/Currency';
import {Groupmember} from './Groupmember';
import {Transaction} from './Transaction';
import {Recommendation} from './Recommendation';
import {Activity} from './Activity';
import {AtomarChange} from './AtomarChange';

export class Group {
  private readonly _groupId: string;
  private readonly _name: string;
  private readonly _currency: Currency;
  private _groupmembers: Groupmember[];
  private _transactions: Transaction[];
  private _recommendations: Recommendation[];
  private _activities: Activity[];

  public constructor(groupId: string, name: string, currency: Currency) {
    this._groupId = groupId;
    this._name = name;
    this._currency = currency;
  }

  public get groupId(): string {
    return this._groupId;
  }

  public get name(): string {
    return this._name;
  }

  public get currency(): Currency {
    return this._currency;
  }

  public get groupmembers(): Groupmember[] {
    return this._groupmembers;
  }

  public get transactions(): Transaction[] {
    return this._transactions;
  }

  public get recommendations(): Recommendation[] {
    return this._recommendations;
  }

  public get activities(): Activity[] {
    return this._activities;
  }

  public addGroupmember(groupmember: Groupmember): void { // TODO: OPTIONAL: sort array or insert in right position to ensure post-condition
    this._groupmembers.push(groupmember);
  }

  public removeGroupmember(contactId: string): void { // TODO: implement it. DONE. Untested.
    this._groupmembers.forEach( (item, index) => {
      if (item.contact.contactId === contactId) { this._groupmembers.splice(index, 1); }
    });
  }

  public addTransaction(transaction: Transaction): void { // TODO: OPTIONAL: sort array or insert in right position to ensure post-condition
    this._transactions.push(transaction);
  }

  public editTransaction(transactionId: string, name: string, payer: AtomarChange, recipiants: AtomarChange[]): void {
    const transaction = this.getTransaction(transactionId);
    if (transaction != null) {
      transaction.name = name;
      transaction.payer = payer;
      transaction.recipiants = recipiants;
    }
  }

  private getTransaction(transactionId: string): Transaction { // TODO: OPTIONAL: make public maybe.
    for (const transaction of this._transactions) {
      if (transaction.transactionId === transactionId) {
        return transaction;
      }
    }
  }

  public setRecommendations(recommendations: Recommendation[]): void {
    this._recommendations = recommendations;
  }

  public deleteRecommendation(payerId: string, recipiantId: string): void { /* TODO: implement it. DONE. Untested.
  TODO: OPTIONAL: change argument to Id instead of object. DONE*/
    this._recommendations.forEach( (item, index) => {
      if (item.payer.contact.contactId === payerId && item.recipiant.contact.contactId === recipiantId) {
        this._recommendations.splice(index, 1); }
    });
  }

  public addActivity(transaction: Transaction): void { // TODO: OPTIONAL: sort array or insert in right position to ensure post-condition
    this._transactions.push(transaction);
  }

  public calculateBalances(): void { // TODO: implement it when CalculateEmergentData/BalanceCalculatorService is implemented.
  }
}
