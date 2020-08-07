import {Injectable} from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {DataModelService} from '../DataModel/data-model.service';

@Injectable({
  providedIn: 'root'
})
export class BasicDataUpdateService {
  private observables: ObservableInterface;

  constructor(observables: ObservableService, private dataModel: DataModelService) {
    console.log('This is BasicDataUpdateService');
    this.observables = observables;
    this.createUser();
  }

  public async createUser(): Promise<void> {
    this.observables.getUserObservable().subscribe(param => {
      new User(new Contact(param.contactId, param.name),
        this.currencyStringToEnum(param.currency), this.languageStringToEnum(param.language));
      this.updateDefaultCurrency();
      this.addGroup();
    });
  }

  private async addGroup(): Promise<void> {
    // do things in subscribe()
    this.observables.getGroupsObservable().subscribe();
  }

  private updateDefaultCurrency(): void {
    this.observables.getSettingsCurrencyObservable().subscribe();
  }
}
