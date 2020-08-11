import {Injectable} from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {DataModelService} from '../DataModel/data-model.service';
import {Currency} from '../DataModel/Utils/Currency';
import {User} from '../DataModel/User/User';
import {Contact} from '../DataModel/Group/Contact';
import {Language} from '../DataModel/Utils/Language';
import {Groupmember} from "../DataModel/Group/Groupmember";
import {Utils} from "../ServerCommunication/Response/Utils";

@Injectable({
  providedIn: 'root'
})
export class BasicDataUpdateService {
  private observables: ObservableInterface;

  constructor(observables: ObservableService, private dataModel: DataModelService) {
    if (Utils.log) console.log('This is BasicDataUpdateService');
    this.observables = observables;
    this.createUser();
  }

  public createUser(): void {
    this.observables.getUserObservable().subscribe(param => {
      if (Utils.log) console.log('call user constructor');
      new User(new Contact(param.contactId, param.name),
        this.currencyStringToEnum(param.currency), this.languageStringToEnum(param.language));
      // invoke all methods
      this.updateDefaultCurrency();
      this.addGroup();
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

  private currencyStringToEnum(currencyString: string): Currency {
    let currencyEnum: Currency;
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
    let languageEnum: Language;
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
}
