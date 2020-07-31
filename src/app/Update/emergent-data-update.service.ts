import {Injectable} from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';

@Injectable({
  providedIn: 'root'
})
export class EmergentDataUpdateService {
  private observables: ObservableInterface;

  // injection of DataModelService is missing
  constructor(observables: ObservableInterface) {
    this.observables = observables;
  }

  private updateBalances(groupID: string, balances: number[], participantIds: string[]): void {
    return null;
  }

  private updateRecommendationsForUserPaybacks(groupID: string, amounts: number[], receiverIds: string[]): void {
    return null;
  }
}
