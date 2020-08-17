import {Injectable} from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {DataModelService} from '../DataModel/data-model.service';
import {Currency} from '../DataModel/Utils/Currency';
import {Contact} from '../DataModel/Group/Contact';
import {Language} from '../DataModel/Utils/Language';
import {Groupmember} from "../DataModel/Group/Groupmember";
import {Utils} from "../ServerCommunication/Response/Utils";
import {Transaction} from "../DataModel/Group/Transaction";
import {TransactionType} from "../DataModel/Group/TransactionType";
import {
  GroupActivityType,
  GroupMemberType,
  TransactionType as TransactionTypeInterface
} from "../ServerCommunication/CommunicationInterface/parameterTypes";
import {AtomarChange} from "../DataModel/Group/AtomarChange";
import {Activity} from "../DataModel/Group/Activity";
import {ActivityType} from "../DataModel/Group/ActivityType";

@Injectable({
  providedIn: 'root'
})
export class BasicDataUpdateService {
  private observables: ObservableInterface;
  private transactionBuffer: TransactionTypeInterface[][] = [[]];
  private activityBuffer: GroupActivityType[] = [];
  private membershipBuffer: GroupMemberType[] = [];

  constructor(observables: ObservableService, private dataModel: DataModelService) {
    if (Utils.log) console.log('This is BasicDataUpdateService');
    this.observables = observables; // TODO imlement observableInterface
    this.createUser();
  }

  /**
   * Initializes the user in the DataModel at login.
   */
  public createUser(): void {
    this.observables.getUserObservable().subscribe(param => {
      if (Utils.log) console.log('call user constructor');
      this.dataModel.initializeUserThisSession(param.contactId, param.name, this.currencyStringToEnum(param.currency),
        this.languageStringToEnum(param.language))
    });
  }

  /**
   * Creates a group and adds it to the groups in dataModel.groups. Adds all groupmembers to the group.
   */
  private async addGroup(): Promise<void> {
    this.observables.getGroupsObservable().subscribe(param => {
      if (!param.isLeave) {
        if (Utils.log) console.log('New group detected:' + param.groupId);
        this.dataModel.getUser().createGroup(param.groupId, param.groupName, this.currencyStringToEnum(param.currency));
        const newGroup = this.dataModel.getGroup(param.groupId);
        for (let i = 0; i < param.userIds.length; i++) {
          newGroup.addGroupmember(new Groupmember(new Contact(param.userIds[i], param.userNames[i]), newGroup));
        }
        this.checkBuffer(param.groupId);
      }
      else {
        if (Utils.log) console.log('Group deleted:' + param.groupId);
        this.dataModel.user.removeGroup(param.groupId)}
    });
  }

  private checkBuffer(groupId: string): void {
    this.activityBuffer.forEach( (item, index) => {
      if (item.groupId === groupId) {
        this.addGroupActivityFromBuffer(item);
        this.activityBuffer.splice(index, 1);
      }
    });
    this.transactionBuffer.forEach( (item, index) => {
      if (item[0].groupId === groupId) {
        this.updateNewGroupTransactionsFromBuffer(item);
        this.activityBuffer.splice(index, 1);
      }
    });
    this.membershipBuffer.forEach( (item, index) => {
      if (item[0].groupId === groupId) {
        this.updateGroupMemberFromBuffer(item);
        this.activityBuffer.splice(index, 1);
      }
    });
  }

  /**
   * Creates an activity for the creation of a group.
   */
  private async addGroupActivity(): Promise<void> {
    this.observables.getGroupActivityObservable().subscribe(param => {
      if (this.dataModel.getGroup(param.groupId) != null) {
        if (Utils.log) console.log('Added group activity: ' + param.groupId);
        const group = this.dataModel.getGroup(param.groupId);
        const activity = new Activity(ActivityType.GROUPCREATION, group, group.getGroupmember(param.creatorId).contact, param.creationDate);
        group.addActivity(activity);
      }
      else {
        if (Utils.log) console.log('Group activity pushed to buffer: ' + param.groupId);
        this.activityBuffer.push(param);
      }
    });
  }

  private async addGroupActivityFromBuffer(groupActivity: GroupActivityType): Promise<void> {
    if (this.dataModel.getGroup(groupActivity.groupId) != null) {
      if (Utils.log) console.log('Added group activity from buffer: ' + groupActivity.groupId);
      const group = this.dataModel.getGroup(groupActivity.groupId);
      const activity = new Activity(ActivityType.GROUPCREATION, group, group.getGroupmember(groupActivity.creatorId).contact, groupActivity.creationDate);
      group.addActivity(activity);
    }
    else {
      if (Utils.log) console.log('Group activity creation from buffer failed. Pushed back to buffer: ' + groupActivity.groupId);
      this.activityBuffer.push(groupActivity);
    }
  }

  /**
   * Updates the user's default currency setting in the DataModel.
   */
  private async updateDefaultCurrency(): Promise<void> {
    this.observables.getSettingsCurrencyObservable().subscribe(param => {
      if (Utils.log) console.log('BasicDataUpdateService got currency ' + param.currency);
      this.dataModel.getUser().currency = this.currencyStringToEnum(param.currency);
    });
  }

  /**
   * Updates the user's language setting in the DataModel.
   */
  private async updateDefaultLanguage(): Promise<void> {
    this.observables.getSettingsLanguageObservable().subscribe(param => {
      if (Utils.log) console.log('BasicDataUpdateService got language ' + param.language);
      this.dataModel.getUser().language = this.languageStringToEnum(param.language);
    });
  }

  /**
   * Adds a groupmember to a group if isLeave is false. Removes a groupmember from a group if isLeave is true.
   * TODO: create an activity. both times.
   */
  private async updateGroupMember(): Promise<void> {
    this.observables.getGroupMembershipObservable().subscribe( param => {
      if (this.dataModel.getGroup(param.groupId) == null) {
        if (!param.isLeave) {
          if (Utils.log) console.log('BasicDataUpdateService got member: ' + param.name + ' (' + param.userId + ')');
          const group = this.dataModel.getGroup(param.groupId);
          if (group.getGroupmember(param.userId) === null) {
            const newMember = new Groupmember(new Contact(param.userId, param.name), group);
            group.addGroupmember(newMember);
          }
        }
        else {
          const group = this.dataModel.getGroup(param.groupId);
          if (group.getGroupmember(param.groupId) != null) {
            if (Utils.log) console.log('BasicDataUpdateService removed member ' + param.name + '(' + param.userId + ')');
            const group = this.dataModel.getGroup(param.groupId);
            group.removeGroupmember(param.userId);
          }
        }
      }
      else {
        this.membershipBuffer.push(param);
        if (Utils.log) console.log('new member pushed to buffer: ' + param.name + ' (' + param.userId + ')');
      }
    });
  }

  private updateGroupMemberFromBuffer(groupMember: GroupMemberType): void {
    if (this.dataModel.getGroup(groupMember.groupId) == null) {
      if (!groupMember.isLeave) {
        if (Utils.log) console.log('BasicDataUpdateService got member from buffer: ' + groupMember.name + ' (' + groupMember.userId + ')');
        const group = this.dataModel.getGroup(groupMember.groupId);
        if (group.getGroupmember(groupMember.userId) === null) {
          const newMember = new Groupmember(new Contact(groupMember.userId, groupMember.name), group);
          group.addGroupmember(newMember);
        }
      }
      else {
        const group = this.dataModel.getGroup(groupMember.groupId);
        if (group.getGroupmember(groupMember.groupId) != null) {
          if (Utils.log) console.log('BasicDataUpdateService removed member (got request from buffer): '
            + groupMember.name + '(' + groupMember.userId + ')');
          const group = this.dataModel.getGroup(groupMember.groupId);
          group.removeGroupmember(groupMember.userId);
        }
      }
    }
    else {
      this.membershipBuffer.push(groupMember);
      if (Utils.log) console.log('Membership creation/deletion from buffer failed. Pushed back to buffer: '
        + groupMember.name + ' (' + groupMember.userId + ')');
    }
  }

  private updateSingleTransaction(param: TransactionTypeInterface): Transaction {
    console.log('BasicDataUpdateService got new transaction ' + param.transactionId);
      const group = this.dataModel.getGroup(param.groupId);
      let payer = new AtomarChange(group.getGroupmember(param.payerId).contact, param.payerAmount);
      let recipients: AtomarChange[] = [];
      for (let i = 0; i < param.recipientIds.length; i++) {
        recipients.push(new AtomarChange(group.getGroupmember(param.recipientIds[i]).contact, param.recipientAmounts[i]));
      }
      let sender = group.getGroupmember(param.senderId);
      const newTransaction = new Transaction(this.transactionStringToEnum(param.transactionType), param.transactionId,
        param.name, param.creationDate, group, payer, recipients, sender);
      group.addTransaction(newTransaction);
      return newTransaction;
  }

  /**
   * Edits an existing transaction of a group in the DataModel.
   * TODO: create activity.
   */
  private async updateModifiedGroupTransaction(): Promise<void> {
    this.observables.getModifiedTransactionObservable().subscribe(param => {
      if (Utils.log) console.log('BasicDataUpdateService modified transaction: ' + param.transactionId);
      const group = this.dataModel.getGroup(param.groupId);
      let payer = new AtomarChange(group.getGroupmember(param.payerId).contact, param.payerAmount);
      let recipients: AtomarChange[] = [];
      for (let i = 0; i < param.recipientIds.length; i++) {
        recipients.push(new AtomarChange(group.getGroupmember(param.recipientIds[i]).contact, param.recipientAmounts[i]));
      }
      group.editTransaction(param.transactionId, param.name, payer, recipients);
      // TODO: Edit Balances after editing a transaction.
    });
  }

  /**
   * Adds a number of transactions to a group. Calculates balances for this group afterwards.
   * TODO: create activity. dont calculate recommendations of all transactions are PAYBACK. remove recommendations from group.
   */
  private async updateNewGroupTransactions(): Promise<void> {
    this.observables.getMultipleNewTransactionsObservable().subscribe(param => {
      if (this.dataModel.getGroup(param[0].groupId) != null) {
        if (Utils.log) console.log('BasicDataUpdateService added transactions for group: ' + param[0].groupId);
        const multipleTransactions: Transaction[] = [];
        for (const transactionType of param) {
          let currentTransaction = this.updateSingleTransaction(transactionType);
          multipleTransactions.push(currentTransaction);
        }
        let promise = this.dataModel.calculateBalances(param[0].groupId, multipleTransactions,
          param[param.length - 1].groupId);
      }
      else {
        if (Utils.log) console.log('transactions for group pushed to buffer: ' +  param[0].groupId);
        this.transactionBuffer.push(param);
      }
    });
  }

  private updateNewGroupTransactionsFromBuffer(transactions: TransactionTypeInterface[]) {
    if (this.dataModel.getGroup(transactions[0].groupId) != null) {
      if (Utils.log) console.log('BasicDataUpdateService added transactions from buffer for group: ' + transactions[0].groupId);
      const multipleTransactions: Transaction[] = [];
      for (const transaction of transactions) {
        let currentTransaction = this.updateSingleTransaction(transaction);
        multipleTransactions.push(currentTransaction);
      }
      let promise = this.dataModel.calculateBalances(transactions[0].groupId, multipleTransactions,
        transactions[transactions.length - 1].groupId);
    }
    else {
      if (Utils.log) console.log('Transactions creation from buffer failed. Pushed back to buffer: ' +  transactions[0].groupId);
      this.transactionBuffer.push(transactions);
    }
  }

  private currencyStringToEnum(currencyString: string): Currency {
    let currencyEnum: Currency = Currency.EUR;
    switch (currencyString) {
      case ('EURO'): {
        currencyEnum = Currency.EUR;
        break;
      }
      case ('USD'): {
        currencyEnum = Currency.USD;
        break;
      }
    }
    return currencyEnum;
  }

  private languageStringToEnum(languageString: string): Language {
    let languageEnum: Language = Language.ENGLISH;
    switch (languageString) {
      case ('GERMAN'): {
        languageEnum = Language.GERMAN;
        break;
      }
      case ('ENGLISH'): {
        languageEnum = Language.ENGLISH;
        break;
      }
    }
    return languageEnum;
  }

  private transactionStringToEnum(transactionString: string): TransactionType {
    let transactionType: TransactionType = TransactionType.EXPENSE;
    switch (transactionString) {
      case ('EXPENSE'): {
        transactionType = TransactionType.EXPENSE;
        break;
      }
      case ('PAYBACK'): {
        transactionType = TransactionType.PAYBACK;
        break;
      }
    }
    return transactionType;
  }
}
