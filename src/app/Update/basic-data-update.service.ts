import { Injectable } from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';

@Injectable({
  providedIn: 'root'
})
export class BasicDataUpdateService {
  private observables: ObservableInterface;

  // injection of DataModelService is missing
  constructor(observables: ObservableService) {
    this.observables = observables;
    this.addGroup();
  }

  private addGroup(): void {
    // do things in subscribe()
    this.observables.getGroupsObservable().subscribe();
  }
}
