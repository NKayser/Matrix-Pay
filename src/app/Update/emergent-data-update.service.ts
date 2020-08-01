import {Injectable} from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';

@Injectable({
  providedIn: 'root'
})
export class EmergentDataUpdateService {
  observables: ObservableInterface;

  // injection of DataModelService is missing
  constructor(observables: ObservableInterface) {
    this.observables = observables;
    this.listenToChanges();
  }

  listenToChanges(): void {
    this.observables.getBalancesObservable().subscribe(
      parameters => this.updateBalances(parameters.groupId, parameters.balances, parameters.participantIds)
    );
    this.observables.getRecommendationsObservable().subscribe(
      parameters => this.updateRecommendationsForUserPaybacks(parameters.groupId, parameters.amounts, parameters.receiverIds)
    );
  }

  // The following methods execute the changes in DataModel
  private updateBalances(groupID: string, balances: number[], participantIds: string[]): void {
    return null;
  }

  private updateRecommendationsForUserPaybacks(groupID: string, amounts: number[], receiverIds: string[]): void {
    return null;
  }
}
