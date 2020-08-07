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
    this.addGroup();
    this.updateDefaultCurrency();
  }

  private addGroup(): void {
    // do things in subscribe()
    this.observables.getGroupsObservable().subscribe();
  }

  private updateDefaultCurrency(): void {
    this.observables.getSettingsCurrencyObservable().subscribe();
  }
}
