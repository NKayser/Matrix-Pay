import { Injectable } from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';

@Injectable({
  providedIn: 'root'
})
export class BasicDataUpdateService {
  private observables: ObservableInterface;

  // injection of DataModelService is missing
  constructor(observables: ObservableInterface) {
    this.observables = observables;
    this.listenToChanges();
  }

  private listenToChanges(): void {
    this.observables.getGroupsObservable().subscribe(
      parameters => this.addGroup(parameters.groupId, parameters.groupName, parameters.userIds, parameters.userNames, parameters.isLeave)
    );
  }

  private addGroup(groupId: string, groupName: string, userIds: string[], userNames: string[], isLeave: boolean): void {
    return null;
  }
}
