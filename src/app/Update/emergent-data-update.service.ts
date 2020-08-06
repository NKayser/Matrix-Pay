import {Injectable} from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';
import {Observable} from 'rxjs';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';

@Injectable({
  providedIn: 'root'
})
export class EmergentDataUpdateService {
  observables: ObservableInterface;

  // injection of DataModelService is missing
  constructor(observables: ObservableService) {
    this.observables = observables;
    // invoke all methods
    this.updateBalances();
    this.updateRecommendationsForUserPaybacks();
  }

  private updateBalances(): void {
    this.observables.getBalancesObservable().subscribe();
  }

  private updateRecommendationsForUserPaybacks(): void {
    this.observables.getRecommendationsObservable().subscribe();
  }
}
