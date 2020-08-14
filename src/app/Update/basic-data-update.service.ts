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
import {AtomarChange} from "../DataModel/Group/AtomarChange";

@Injectable({
  providedIn: 'root'
})
export class BasicDataUpdateService {
  private observables: ObservableInterface;

  constructor(observables: ObservableService, private dataModel: DataModelService) {
    if (Utils.log) console.log('This is BasicDataUpdateService');
    this.observables = observables; // TODO imlement observableInterface
    this.createUser();
  }

  public createUser(): void {
    this.observables.getUserObservable().subscribe(param => {
      if (Utils.log) console.log('call user constructor');
      this.dataModel.initializeUserThisSession(param.contactId, param.name, this.currencyStringToEnum(param.currency),
        this.languageStringToEnum(param.language))
    });
  }

  private async addGroup(): Promise<void> {
    this.observables.getGroupsObservable().subscribe(param => {
      if (!param.isLeave) {
        if (Utils.log) console.log('new group detected');
        this.dataModel.getUser().createGroup(param.groupId, param.groupName, this.currencyStringToEnum(param.currency));
        const newGroup = this.dataModel.getGroup(param.groupId);
        for (let i = 0; i < param.userIds.length; i++) {
          newGroup.addGroupmember(new Groupmember(new Contact(param.userIds[i], param.userNames[i]), newGroup));
        }
      }
    });
  }

  private async updateDefaultCurrency(): Promise<void> {
    this.observables.getSettingsCurrencyObservable().subscribe(param => {
        if (Utils.log) console.log('BasicDataUpdateService got currency ' + param.currency);
        this.dataModel.getUser().currency = this.currencyStringToEnum(param.currency);
      }
    );
  }

  private async updateGroupMember(): Promise<void> {
    this.observables.getGroupMembershipObservable().subscribe( param => {
      if (Utils.log) console.log('BasicDataUpdateService got member ' + param.name);
      const group = this.dataModel.getGroup(param.groupId);
      const newMember = new Groupmember(new Contact(param.userId, param.name), group);
      group.addGroupmember(newMember);
    });
  }

  private async updateNewGroupTransactions(): Promise<void> {
  this.observables.getNewTransactionObservable().subscribe( param => {
    if (Utils.log) console.log('BasicDataUpdateService got new transaction ' + param.transactionId);

    const group = this.dataModel.getGroup(param.groupId);
    let payer = new AtomarChange(group.getGroupmember(param.payerId).contact, param.payerAmount);
    let recipients: AtomarChange[];
    for (let i = 0; i < param.recipientIds.length; i++) {
      recipients.push(new AtomarChange(group.getGroupmember(param.recipientIds[i]).contact, param.recipientAmount[i]));
    }
    let sender = group.getGroupmember(param.senderId);
    const newTransaction = new Transaction(this.transactionStringToEnum(param.transactionType), param.transactionId,
      param.name, param.creationDate, group, payer, recipients, sender);
    group.addTransaction(newTransaction);
  }
  );
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
