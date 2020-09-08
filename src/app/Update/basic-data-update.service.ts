import {Injectable} from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {DataModelService} from '../DataModel/data-model.service';
import {Currency, matrixCurrencyMap} from '../DataModel/Utils/Currency';
import {Contact} from '../DataModel/Group/Contact';
import {Language} from '../DataModel/Utils/Language';
import {Groupmember} from '../DataModel/Group/Groupmember';
import {Utils} from '../ServerCommunication/Response/Utils';
import {Transaction} from '../DataModel/Group/Transaction';
import {TransactionType} from '../DataModel/Group/TransactionType';
import {
  TransactionType as TransactionTypeInterface
} from '../ServerCommunication/CommunicationInterface/parameterTypes';
import {AtomarChange} from '../DataModel/Group/AtomarChange';
import {Activity} from '../DataModel/Group/Activity';
import {ActivityType} from '../DataModel/Group/ActivityType';
import {Time} from '../SystemTests/Time';
import {StorageService} from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class BasicDataUpdateService {
  private observables: ObservableInterface;
  /*private transactionBuffer: TransactionTypeInterface[][] = [];
  private activityBuffer: GroupActivityType[] = [];
  private membershipBuffer: GroupMemberType[] = [];
  private groupBuffer: GroupsType[] = [];
  private languageBuffer: LanguageType[] = [];
  private currencyBuffer: CurrencyType[] = []; */

  constructor(observables: ObservableService, private dataModel: DataModelService, /*storage: StorageService*/) {
    if (Utils.log) { console.log('This is BasicDataUpdateService'); }
    this.observables = observables; // TODO implement observableInterface
    this.createUser();
    this.addGroup();
    this.addGroupActivity();
    this.updateDefaultCurrency();
    this.updateDefaultLanguage();
    this.addGroupMember();
    // this.updateModifiedGroupTransaction();
    this.updateNewGroupTransactions();
  }

  /**
   * Initializes the user in the DataModel at login.
   */
  public createUser(): void {
    this.observables.getUserObservable().subscribe(param => {
      console.log('updateService: createUser: user filled in: ' + param.contactId + ' , ' + param.name);
      this.dataModel.fillInUserData(param.contactId, param.name, this.currencyStringToEnum(param.currency),
        this.languageStringToEnum(param.language));
      // TEST FOR LOCAL STORAGE

      const currentToken = localStorage.getItem('token');
      switch (currentToken) {
        case '':
          console.log('updateService: createUser: token was \'\'. Now being changed to \'token1\'');
          localStorage.setItem('token', 'token1');
          break;
        case 'token1':
          console.log('updateService: createUser: token was \'token1\'. Now being changed to \'token2\'');
          localStorage.setItem('token', 'token2');
          break;
        case 'token2':
          console.log('updateService: createUser: token was \'token2\'. Now being changed to \'token3\'');
          localStorage.setItem('token', 'token3');
          break;
        case 'token3':
          console.log('updateService: createUser: token was \'token3\'. Now being changed to \'token1\'');
          localStorage.setItem('token', 'token1');
          break;
        default:
          console.log('updateService: createUser: token was none of the above. Now being changed to \'token1\'');
          localStorage.setItem('token', 'token1');
          break;
      }

    });
  }

  /**
   * Creates a group and adds it to the groups in dataModel.groups. Adds all groupmembers to the group.
   */
  private async addGroup(): Promise<void> {
    this.observables.getGroupsObservable().subscribe(param => {
      if (this.dataModel.userExists) {
        if (this.dataModel.getGroup(param.groupId) === null) {
          // console.log ('LOG007.4 user wasnt null');
          if (!param.isLeave) {
            // if (Utils.log) {console.log('New group detected:' + param.groupId);}
            this.dataModel.getUser().createGroup(param.groupId, param.groupName, this.currencyStringToEnum(param.currency));
            console.log ('updateService: addGroup: group created: ' + param.groupId + ' , ' + param.groupName);
            // TimeStamp
            const startTime = Time.groupCreationTime;
            if (startTime > 0) {
              console.log('updateService: addGroup: time taken for group: ' + param.groupName + ': ' + (Date.now() - startTime));
            }
            // TimeStamp
            const newGroup = this.dataModel.getGroup(param.groupId);
            for (let i = 0; i < param.userIds.length; i++) {
              if (newGroup.getGroupmember(param.userIds[i]) === null) {
                newGroup.addGroupmember(new Groupmember(new Contact(param.userIds[i], param.userNames[i]), newGroup));
                console.log ('updateService: addGroup: member created: ' + param.userIds[i] + ' , ' + param.userNames[i]);
              }
              else {
                if (newGroup.getGroupmember(param.userIds[i]).contact.name === '') {
                  const member = newGroup.getGroupmember(param.userIds[i]);
                  member.contact.name = param.userNames[i];
                  console.log ('updateService: addGroup: member filled in: ' + param.userIds[i] + ' , ' + param.userNames[i]);
                }
              }
            }
          }
          else {
            this.dataModel.user.removeGroup(param.groupId);
            console.log('updateService: addGroup: Group deleted: ' + param.groupId + ' , ' + param.groupName);
          }
        }
        else {
          if (!param.isLeave) {
            const newGroup = this.dataModel.getGroup(param.groupId);
            newGroup.name = param.groupName;
            newGroup.currency = this.currencyStringToEnum(param.currency);
            console.log ('updateService: addGroup: group filled in: ' + param.groupId + ' , ' + param.groupName);
            // TimeStamp
            const startTime = Time.groupCreationTime;
            if (startTime > 0) {
              console.log('updateService: addGroup: time taken for group: ' + param.groupName + ': ' + (Date.now() - startTime));
            }
            // TimeStamp
          }
          else {
            this.dataModel.user.removeGroup(param.groupId);
            console.log('updateService: addGroup: Group deleted: ' + param.groupId + ' , ' + param.groupName);
          }
        }
      }
      else {
        console.log('updateService: addGroup: user wasnt ready yet. this should never happen.');
      }
    });
  }

  /*private async addGroupFromBuffer(param: GroupsType): Promise<void> {
    if (typeof this.dataModel.userExists) {
      if (!param.isLeave) {
        if (Utils.log) {console.log('LOG0072 New group detected from buffer:' + param.groupId); }
        this.dataModel.getUser().createGroup(param.groupId, param.groupName, this.currencyStringToEnum(param.currency));
        const newGroup = this.dataModel.getGroup(param.groupId);
        for (let i = 0; i < param.userIds.length; i++) {
          if (newGroup.getGroupmember(param.userIds[i]) === null) {
            newGroup.addGroupmember(new Groupmember(new Contact(param.userIds[i], param.userNames[i]), newGroup));
          }
        }
        this.checkBuffer(param.groupId);
      }
      else {
        if (Utils.log) { console.log('Group deleted:' + param.groupId); }
        this.dataModel.user.removeGroup(param.groupId)}
    }
    else {
      console.log('LOG0073 user was still not ready, group pushed back to buffer ');
      this.groupBuffer.push(param);
    }
  }*/

  /*private emptyGroupBuffer(): void {
    console.log('LOG0071 emptying groupBuffer');
    const copyGroupBuffer = [...this.groupBuffer];
    this.groupBuffer = [];
    console.log(this.groupBuffer);
    console.log(copyGroupBuffer);
    for (const group of copyGroupBuffer){
      this.addGroupFromBuffer(group);
    }
  }*/

  /*private checkBuffer(groupId: string): void {
    console.log(this.transactionBuffer);
    this.activityBuffer.forEach( (item, index) => {
      if (item.groupId === groupId) {
        this.addGroupActivityFromBuffer(item);
        this.activityBuffer.splice(index, 1);
      }
    });
    this.transactionBuffer.forEach( (item, index) => {
      console.log('item: ');
      console.log(item);
      if (item[0].groupId === groupId) {
        this.updateNewGroupTransactionsFromBuffer(item);
        this.activityBuffer.splice(index, 1);
      }
    });
    this.membershipBuffer.forEach( (item, index) => {
      if (item.groupId === groupId) {
        this.updateGroupMemberFromBuffer(item);
        this.activityBuffer.splice(index, 1);
      }
    });
  }*/

  /**
   * Creates an activity for the creation of a group.
   */
  private async addGroupActivity(): Promise<void> {
    this.observables.getGroupActivityObservable().subscribe(param => {
      let group = this.dataModel.getGroup(param.groupId);
      if (group === null) {
        group = this.dataModel.user.createGroup(param.groupId, '', Currency.EUR);
        console.log('updateService: addGroupActivity: added empty group: ' + param.groupId + ' , ' + group.name);
      }
      let creator = group.getGroupmember(param.creatorId);
      if (creator === null) {
        creator = new Groupmember(new Contact(param.creatorId, ''), group);
        group.addGroupmember(creator);
      }
      const activity = new Activity(ActivityType.GROUPCREATION, group, creator.contact, param.creationDate);
      group.addActivity(activity);
      console.log('updateService: addGroupActivity: ' + param.groupId + ' , ' + group.name);
    });
  }

  /*private async addGroupActivityFromBuffer(groupActivity: GroupActivityType): Promise<void> {
    if (this.dataModel.userExists && this.dataModel.getGroup(groupActivity.groupId) !== null) {
      if (Utils.log) console.log('Added group activity from buffer: ' + groupActivity.groupId);
      const group = this.dataModel.getGroup(groupActivity.groupId);
      const activity = new Activity(ActivityType.GROUPCREATION, group, group.getGroupmember(groupActivity.creatorId).contact,
      groupActivity.creationDate);
      group.addActivity(activity);
    }
    else {
      if (Utils.log) console.log('Group activity creation from buffer failed. Pushed back to buffer: ' + groupActivity.groupId);
      this.activityBuffer.push(groupActivity);
    }
  }*/

  /**
   * Updates the user's default currency setting in the DataModel.
   */
  private async updateDefaultCurrency(): Promise<void> {
    this.observables.getSettingsCurrencyObservable().subscribe(param => {
      this.dataModel.getUser().currency = this.currencyStringToEnum(param.currency);
      console.log('updateService: updateDefaultCurrency: ' + param.currency);
    });
  }

  /**
   * Updates the user's language setting in the DataModel.
   */
  private async updateDefaultLanguage(): Promise<void> {
    this.observables.getSettingsLanguageObservable().subscribe(param => {
        this.dataModel.getUser().language = this.languageStringToEnum(param.language);
        console.log('updateService: updateDefaultLanguage: ' + param.language);
    });
  }

  /*private updateCurrencyFromBuffer(param: CurrencyType): void {
    if (this.dataModel.userExists){
      if (Utils.log) { console.log('BasicDataUpdateService got currency from buffer: ' + param.currency); }
      this.dataModel.getUser().currency = this.currencyStringToEnum(param.currency);
    }
    else {this.currencyBuffer.push(param); }
    if (Utils.log) { console.log('BasicDataUpdateService pushed currency BACK to buffer: ' + param.currency); }
  }*/

  /*private updateLanguageFromBuffer(param: LanguageType): void {
    if (this.dataModel.userExists){
      if (Utils.log) { console.log('BasicDataUpdateService got language from buffer: ' + param.language); }
      this.dataModel.getUser().language = this.languageStringToEnum(param.language);
    }
    else {this.languageBuffer.push(param); }
    if (Utils.log) { console.log('BasicDataUpdateService pushed language BACK to buffer: ' + param.language); }
  }*/

  /*private emptyCurrencyBuffer(): void {
    const copyCurrencyBuffer = [...this.currencyBuffer];
    this.currencyBuffer = [];
    console.log(this.currencyBuffer);
    console.log(copyCurrencyBuffer);
    for (const currency of copyCurrencyBuffer){
      this.updateCurrencyFromBuffer(currency);
    }
  }*/

  /*private emptyLanguageBuffer(): void {
    const copyLanguageBuffer = [...this.languageBuffer];
    this.languageBuffer = [];
    console.log(this.languageBuffer);
    console.log(copyLanguageBuffer);
    for (const language of copyLanguageBuffer){
      this.updateLanguageFromBuffer(language);
    }
  }*/

  /**
   * Adds a groupmember to a group if isLeave is false. Removes a groupmember from a group if isLeave is true.
   * TODO: create an activity. both time.
   */
  private async addGroupMember(): Promise<void> {
    this.observables.getGroupMembershipObservable().subscribe( param => {
      /*console.log(this.dataModel.getGroups());
      console.log(param.groupId);*/
      console.log(param);
      let group = this.dataModel.getGroup(param.groupId);
      if (group === null) {
        group = this.dataModel.user.createGroup(param.groupId, '', Currency.EUR);
        console.log('updateService: addGroupMember: created empty group: ' + param.groupId + ' , ' + group.name);
      }
      let member = group.getGroupmember(param.userId);
      if (!param.isLeave) {
        if (member === null) {
          member = new Groupmember(new Contact(param.userId, param.name), group);
          group.addGroupmember(member);
          const activity = new Activity(ActivityType.NEWCONTACTINGROUP, group, member.contact, param.date);
          group.addActivity(activity);
          console.log('updateService: addGroupMember: created member: ' + param.userId + ' , ' + param.name);
        } else {
          if (member.contact.name === '') {
            member.contact.name = param.name;
            const activity = new Activity(ActivityType.NEWCONTACTINGROUP, group, member.contact, param.date);
            group.addActivity(activity);
            console.log('updateService: addGroupMember: filled in member: ' + param.userId + ' , ' + param.name);
          }
        }
      } else { // isleave
        group.getGroupmember(param.userId).active = false;
        // TODO: MEMBERLEFTGROUPACTIVITY
        console.log('updateService: addGroupMember: set member to inactive: ' + param.userId + ' , ' + param.name);
      }
    });
  }

  /*private updateGroupMemberFromBuffer(groupMember: GroupMemberType): void {
    if (this.dataModel.userExists && this.dataModel.getGroup(groupMember.groupId) !== null) {
      if (!groupMember.isLeave) {
        if (Utils.log) console.log('BasicDataUpdateService got member from buffer: ' + groupMember.name + ' (' + groupMember.userId + ')');
        const group = this.dataModel.getGroup(groupMember.groupId);
        let member = group.getGroupmember(groupMember.userId);
        if (member === null) {
          member = new Groupmember(new Contact(groupMember.userId, groupMember.name), group);
          group.addGroupmember(member);
        }
        const activity = new Activity(ActivityType.NEWCONTACTINGROUP, group, member.contact, groupMember.date);
        group.addActivity(activity);
      }
      else {
        const group = this.dataModel.getGroup(groupMember.groupId);
        if (this.dataModel.userExists && group.getGroupmember(groupMember.groupId) !== null) {
          if (Utils.log) console.log('BasicDataUpdateService removed member (got request from buffer): '
            + groupMember.name + '(' + groupMember.userId + ')');
          const group = this.dataModel.getGroup(groupMember.groupId);
          const deletedMember = group.getGroupmember(groupMember.userId);
          group.removeGroupmember(groupMember.userId);
          const activity = new Activity(ActivityType.CONTACTLEFTGROUP, group, deletedMember.contact, groupMember.date);
          group.addActivity(activity);
        }
      }
    }
    else {
      this.membershipBuffer.push(groupMember);
      if (Utils.log) console.log('Membership creation/deletion from buffer failed. Pushed back to buffer: '
        + groupMember.name + ' (' + groupMember.userId + ')');
    }
  }*/

  private updateSingleTransaction(param: TransactionTypeInterface): Transaction {
    let group = this.dataModel.getGroup(param.groupId);
    if (group === null) {
      group = this.dataModel.user.createGroup(param.groupId, '', Currency.EUR);
      console.log('updateService: updateSingleTransaction: crated empty group: ' + param.groupId);
    }
    let payerContact: Contact;
    if (group.getGroupmember(param.payerId) === null) {
      payerContact = new Contact(param.payerId, '');
      group.addGroupmember(new Groupmember(payerContact, group));
      console.log('updateService: updateSingleTransaction: crated empty payer: ' + param.payerId);
    } else {
      payerContact = group.getGroupmember(param.payerId).contact;
    }
    let sum = 0;
    for (const amount of param.recipientAmounts) {
      sum = sum + amount;
    }
    const payer = new AtomarChange(payerContact, sum);
    const recipients: AtomarChange[] = [];
    for (let i = 0; i < param.recipientIds.length; i++) {
      let recipientContact: Contact;
      if (group.getGroupmember(param.recipientIds[i]) === null) {
        recipientContact = new Contact(param.recipientIds[i], '');
        group.addGroupmember(new Groupmember(recipientContact, group));
        console.log('updateService: updateSingleTransaction: crated empty recipient: ' + param.recipientIds[i]);
      }
      else {recipientContact = group.getGroupmember(param.recipientIds[i]).contact; }
      recipients.push(new AtomarChange(recipientContact, param.recipientAmounts[i]));
    }
    let senderMember: Groupmember;
    if (group.getGroupmember(param.senderId) === null) {
      senderMember = new Groupmember(new Contact(param.senderId, ''), group);
      group.addGroupmember(senderMember);
      console.log('updateService: updateSingleTransaction: crated empty sender: ' + param.senderId);
    }
    else {senderMember = group.getGroupmember(param.senderId); }
    const newTransaction = new Transaction(this.transactionStringToEnum(param.transactionType), param.transactionId,
      param.name, param.creationDate, group, payer, recipients, senderMember);
    group.addTransaction(newTransaction);
    let activity: Activity;
    if (newTransaction.transactionType === TransactionType.EXPENSE){
      activity = new Activity(ActivityType.NEWEXPENSE, newTransaction, senderMember.contact, param.creationDate);
      console.log('updateService: updateSingleTransaction: crated expense: ' + param.transactionId + ' + ' + param.name);
    }
    if (newTransaction.transactionType === TransactionType.PAYBACK){
      activity = new Activity(ActivityType.NEWPAYBACK, newTransaction, senderMember.contact, param.creationDate);
      console.log('updateService: updateSingleTransaction: crated payback: ' + param.transactionId + ' + ' + param.name);
    }
    group.addActivity(activity);
    // TimeStamp
    const timeStamp = Time.getTransactionTimeByID(param.groupId + param.name);
    if (timeStamp > 0) {
      console.log('updateService: updateSingleTransaction: Time Taken for Transaction ' + param.transactionId + ' + ' + param.name + ': '
        + (Date.now() - timeStamp));
    }
    // TimeStamp
    return newTransaction;
  }


  /**
   * Edits an existing transaction of a group in the DataModel.
   * TODO: create activity.
   */
  /*private async updateModifiedGroupTransaction(): Promise<void> {
    this.observables.getModifiedTransactionObservable().subscribe(param => {
      if (Utils.log) console.log('BasicDataUpdateService modified transaction: ' + param.name + ' (' + param.transactionId + ')');
      const group = this.dataModel.getGroup(param.groupId);
      let payer = new AtomarChange(group.getGroupmember(param.payerId).contact, param.payerAmount);
      let recipients: AtomarChange[] = [];
      let sender = group.getGroupmember(param.senderId);
      for (let i = 0; i < param.recipientIds.length; i++) {
        recipients.push(new AtomarChange(group.getGroupmember(param.recipientIds[i]).contact, param.recipientAmounts[i]));
      }
      group.editTransaction(param.transactionId, param.name, payer, recipients);
      const activity = new Activity(ActivityType.NEWEXPENSE, group.getTransaction(param.transactionId), sender.contact, param.creationDate);
      group.addActivity(activity);
      // TODO: Edit Balances after editing a transaction.
    });
  }*/


  /**
   * Adds a number of transactions to a group. Calculates balances for this group afterwards.
   * TODO: create activity. dont calculate recommendations of all transactions are PAYBACK. remove recommendations from group.
   */
  private async updateNewGroupTransactions(): Promise<void> {
    this.observables.getMultipleNewTransactionsObservable().subscribe(param => {

      const multipleTransactions: Transaction[] = [];
      for (const transactionType of param) {
        const currentTransaction = this.updateSingleTransaction(transactionType);
        multipleTransactions.push(currentTransaction);
      }
      const promise = this.dataModel.calculateBalances(param[0].groupId, multipleTransactions,
          param[param.length - 1].groupId);
      console.log('updateService: updateNewGroupTransactions: calculated Balances: ' + param[0].groupId );
    });
  }

/*  private updateNewGroupTransactionsFromBuffer(transactions: TransactionTypeInterface[]) {
    if (this.dataModel.userExists && this.dataModel.getGroup(transactions[0].groupId) !== null) {
      if (Utils.log) console.log('BasicDataUpdateService added transactions from buffer for group: ' + transactions[0].groupId);
      const multipleTransactions: Transaction[] = [];
      for (const transaction of transactions) {
        if (this.dataModel.getGroup(transaction.groupId).getTransaction(transaction.transactionId) === null) {
          let currentTransaction = this.updateSingleTransaction(transaction);
          multipleTransactions.push(currentTransaction);
        }
      }
      const promise = this.dataModel.calculateBalances(transactions[0].groupId, multipleTransactions,
        transactions[transactions.length - 1].groupId);
    }
    else {
      if (Utils.log) console.log('Transactions creation from buffer failed. Pushed back to buffer: ' +  transactions[0].groupId);
      this.transactionBuffer.push(transactions);
    }
  }*/

  private currencyStringToEnum(currencyString: string): Currency {
    let currencyEnum: Currency = Currency.EUR;
    switch (currencyString) {
      case (matrixCurrencyMap[0]): {
        currencyEnum = Currency.EUR;
        break;
      }
      case (matrixCurrencyMap[1]): {
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
