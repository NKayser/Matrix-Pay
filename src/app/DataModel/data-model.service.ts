import { Injectable } from '@angular/core';
import {User} from './User/User';
import {Status} from './Status/Status';
import {Group} from './Group/Group';
import {Transaction} from './Group/Transaction';
import {BalanceCalculatorService} from '../CalculateEmergentData/balance-calculator.service';
import {GreedyOptimisationService} from '../CalculateEmergentData/greedy-optimisation.service';
import {MatrixEmergentDataService} from '../ServerCommunication/CommunicationInterface/matrix-emergent-data.service';

@Injectable({
  providedIn: 'root'
})
export class DataModelService {
  private user: User;
  private status: Status;

  constructor(private balanceCalculator: BalanceCalculatorService,
              private greedyOptimisation: GreedyOptimisationService,
              private matrixEmergentData: MatrixEmergentDataService) { }

  public getGroups(): Group[] {
    return this.user.groups;
  }

  public getGroup(groupId: string): Group { // TODO: implement it. DONE
    return this.user.getGroup(groupId);
  }

  public getStatus(): Status {
    return this.status;
  }

  public calculateBalances(groupId: string, transactions: Transaction[], lastTransactionId: string): void {
    const group = this.getGroup(groupId);
    const Ids: string[] = [];
    const amounts: number[] = [];
    for (const groupmember of group.groupmembers) {
      Ids.push(groupmember.contact.contactId);
      amounts.push(groupmember.balance);
    }
    const problem = this.balanceCalculator.calculateBalances(Ids, amounts, transactions);
    const response = this.matrixEmergentData.setBalances(groupId, problem.getBalances(), problem.getUsers(), lastTransactionId);
    this.status.newResponse(response);
    if (!response.wasSuccessful()) {
      // Do some Error stuff
    }
    else {
      const solution = this.greedyOptimisation.calculateOptimisation(problem);
      const response2 = this.matrixEmergentData.setRecommendations(groupId, solution.getAmounts(), solution.getPayerIds(),
        solution.getRecipiantIds(), lastTransactionId);
      this.status.newResponse(response2);
      if (!response2.wasSuccessful()) {
        // Do some Error stuff
      }
    }
  }
}
