import {Currency} from '../Utils/Currency';
import {Groupmember} from './Groupmember';
import {Transaction} from './Transaction';
import {Recommendation} from './Recommendation';
import {Activity} from './Activity';
import {AtomarChange} from './AtomarChange';

/**
 * Group which the user is part of. A group is something holding groupmembers, transactions, recommendations and activities.
 * It is a cntral object of the application and enables keeping track of shared expenses between people.
 */
export class Group {
  private readonly _groupId: string;
  private readonly _name: string;
  private readonly _currency: Currency;
  private _groupmembers: Groupmember[];
  private _transactions: Transaction[];
  private _recommendations: Recommendation[];
  private _activities: Activity[];

  /**
   * Constructor for Group. In addition to setting the values given by the arguments, groupmembers, transactions, recommendations and
   * activities are initialized as empty arrays.
   * @param groupId  ID of the group.
   * @param name  Name of the group.
   * @param currency  Currency for all transactions in the group.
   */
  public constructor(groupId: string, name: string, currency: Currency) {
    this._groupId = groupId;
    this._name = name;
    this._currency = currency;
    this._groupmembers = [];
    this._transactions = [];
    this._recommendations = [];
    this._activities = [];
  }

  /**
   * Returns the group ID.
   */
  public get groupId(): string {
    return this._groupId;
  }

  /**
   * Returns the name of the group.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Returns the currency of the group.
   */
  public get currency(): Currency {
    return this._currency;
  }

  /**
   * Returns an array with all the group's groupmembers.
   */
  public get groupmembers(): Groupmember[] {
    return this._groupmembers;
  }

  /**
   * Returns an array with all the group's transactions.
   */
  public get transactions(): Transaction[] {
    return this._transactions;
  }

  /**
   * Returns an array with all the group's recommendations.
   */
  public get recommendations(): Recommendation[] {
    return this._recommendations;
  }

  /**
   * Returns an array with all the group's activities.
   */
  public get activities(): Activity[] {
    return this._activities;
  }

  /**
   * Adds a new groupmember to the group.
   * @param groupmember  The groupmember that should be added.
   */
  public addGroupmember(groupmember: Groupmember): void { // TODO: OPTIONAL: sort array or insert in right position to ensure post-condition
    this._groupmembers.push(groupmember);
  }

  /**
   * removes a groupmember from the group.
   * @param contactId  Contact Id of the groupmember that should be removed.
   */
  public removeGroupmember(contactId: string): void { // TODO: ensure somewhere that only groupmembers whith zero balance can be removed
    this._groupmembers.forEach( (item, index) => {
      if (item.contact.contactId === contactId) { this._groupmembers.splice(index, 1); }
    });
  }

  /**
   * Adds a transaction to the group.
   * @param transaction  Transaction that should be added to the group.
   */
  public addTransaction(transaction: Transaction): void { // TODO: OPTIONAL: sort array or insert in right position to ensure post-condition
    this._transactions.push(transaction);
  }

  /**
   * Edits a transaction by setting its values to the values specified in the arguments.
   * @param transactionId  ID of the transaction that should be edited. The ID cannot be edited, it serves to identify the transaction.
   * @param name  New name for the transaction.
   * @param payer  New payer for the transaction.
   * @param recipients  New recipients for the transaction.
   */
  public editTransaction(transactionId: string, name: string, payer: AtomarChange, recipients: AtomarChange[]): void {
    const transaction = this.getTransaction(transactionId);
    if (transaction != null) {
      transaction.name = name;
      transaction.payer = payer;
      transaction.recipients = recipients;
    }
  }

  /**
   * Returns a specific transaction speified by transaction ID. Reuturns null of no transaction of that ID is in the group.
   * @param transactionId  ID of the transaction that should be returned.
   */
  public getTransaction(transactionId: string): Transaction {
    for (const transaction of this._transactions) {
      if (transaction.transactionId === transactionId) {
        return transaction;
      }
    }
    return null;
  }

  /**
   * Sets the array with current Recommendations for the group. Since recommendations only make sense as a whole, single recommendations
   * cannot be added.
   * @param recommendations  New recommendations for the group.
   */
  public setRecommendations(recommendations: Recommendation[]): void {
    this._recommendations = recommendations;
  }

  /**
   * Deletes a Recommendation from the recommendation array. This should only be done when a transaction of the type PAYBACK is added.
   * @param payerId  ID of the payer that was part of the recommendation.
   * @param recipiantId  ID of the recipiant that was part of the recommendation.
   */
  public deleteRecommendation(payerId: string, recipiantId: string): void { /* TODO: implement it. DONE. Untested.
  TODO: OPTIONAL: change argument to Id instead of object. DONE*/
    this._recommendations.forEach( (item, index) => {
      if (item.payer.contact.contactId === payerId && item.recipient.contact.contactId === recipiantId) {
        this._recommendations.splice(index, 1); }
    });
  }

  /**
   * Adds an Activity to the group.
   * @param activity  Activity that should be added.
   */
  public addActivity(activity: Activity): void { // TODO: OPTIONAL: sort array or insert in right position to ensure post-condition
    this._activities.push(activity);
  }
}
