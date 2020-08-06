import {Injectable} from '@angular/core';
import {ObservableInterface} from '../ServerCommunication/CommunicationInterface/observableInterface';
import {Observable} from 'rxjs';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {DataModelService} from '../DataModel/data-model.service';
import {Recommendation} from '../DataModel/Group/Recommendation';
import {AtomarChange} from '../DataModel/Group/AtomarChange';
import {Groupmember} from '../DataModel/Group/Groupmember';
import {Contact} from '../DataModel/Group/Contact';

@Injectable({
  providedIn: 'root'
})
export class EmergentDataUpdateService {
  observables: ObservableInterface;

  // injection of DataModelService is missing
  constructor(observables: ObservableService, private dataModel: DataModelService) {
    this.observables = observables;
    // invoke all methods
    this.updateBalances();
    this.updateRecommendationsForUserPaybacks();
  }

  private updateBalances(): void {
    this.observables.getBalancesObservable().subscribe(
      param => {
        for (let i = 0; i < param.participantIds.length; i++) {
          this.findGroupMember(param.groupId, param.participantIds[i]).balance = param.balances[i];
        }
      }
    );
  }

  private updateRecommendationsForUserPaybacks(): void {
    this.observables.getRecommendationsObservable().subscribe(
      param => {
        let recommendations: Recommendation[];
        for (let i = 0; i < param.receiverIds.length; i++) {
          recommendations.push(new Recommendation(this.dataModel.getGroup(param.groupId),
            new AtomarChange(this.findContact(param.groupId, param.payerIds[i]), -1 * param.amounts[i]),
            new AtomarChange(this.findContact(param.groupId, param.receiverIds[i]), param.amounts[i])));
        }
        this.dataModel.getGroup(param.groupId).setRecommendations(recommendations);
      }
    );
  }

  private findContact(groupId: string, contactId: string): Contact {
    const groupmembers = this.dataModel.getGroup(groupId).groupmembers;
    for (const member of groupmembers) {
      if (member.contact.contactId === contactId) {
        return member.contact;
      }
      return null;
    }
  }

  private findGroupMember(groupId: string, contactId: string): Groupmember {
    const groupmembers = this.dataModel.getGroup(groupId).groupmembers;
    for (const member of groupmembers) {
      if (member.contact.contactId === contactId) {
        return member;
      }
      return null;
    }
  }
}
