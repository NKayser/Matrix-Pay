import { Injectable } from '@angular/core';
import {ProblemInstance} from './problemInstance';
import {Transaction} from '../DataModel/Group/Transaction';
import {Groupmember} from '../DataModel/Group/Groupmember';
// as soon as available, import Transaction from DataModel
// import {Transaction} from './DataModel/Transaction'

@Injectable({
  providedIn: 'root'
})
/**
 * Service for calculating the balances the user saves for all groupmembers of one group resulting from a number of given new transactions
 * and the previous balances.
 */
export class BalanceCalculatorService {
  /**
   * Constructor for BalanceCalculatorService.
   */
  constructor() { }

  /**
   * Calculates new balances for all groupmembers of one group and overwrites the values
   * @param groupmembers  Groupmembers of the group for which the balances should be created.
   * @param transactions  Transactions that should affect this calculation.
   */
  calculateBalances(groupmembers: Groupmember[], transactions: Transaction[]): ProblemInstance {
    for (const transaction of transactions) {
      let id = transaction.payer.contact.contactId;
      let amount = transaction.payer.amount;
      for (const groupmember of groupmembers) {
        // TODO: filter transactions by group in observableservice instead of here. change back here afterwards.
        if (groupmember.contact.contactId === id && groupmember.group.groupId === transaction.group.groupId) {groupmember.balance += amount; break; }
      }
      for (const recipient of transaction.recipients) {
        id = recipient.contact.contactId;
        amount = recipient.amount;
        for (const groupmember of groupmembers) {
          // TODO: filter transactions by group in observableservice instead of here. change back here afterwards.
          if (groupmember.contact.contactId === id && groupmember.group.groupId === transaction.group.groupId) {groupmember.balance -= amount; break; }
        }
      }
    }
    return new ProblemInstance(groupmembers);
  }
}
