import { Injectable } from '@angular/core';
import {ProblemInstance} from './problemInstance';
import {Transaction} from '../DataModel/Group/Transaction';
// as soon as available, import Transaction from DataModel
// import {Transaction} from './DataModel/Transaction'

@Injectable({
  providedIn: 'root'
})
export class BalanceCalculatorService {

  constructor() { }

  // to be implemented: calculation of balances
  calculateBalances(contactIds: string[], amounts: number[], transactions: Transaction[]): ProblemInstance {
    for (const transaction of transactions) {
      let id = transaction.payer.contact.contactId;
      let amount = transaction.payer.amount;
      for (let i = 0; i < contactIds.length; i++) {
        if (contactIds[i] === id) {amounts[i] += amount; break; }
      }
      for (const recipient of transaction.recipients) {
        id = recipient.contact.contactId;
        amount = recipient.amount;
        for (let i = 0; i < contactIds.length; i++) {
          if (contactIds[i] === id) {amounts[i] -= amount; break; }
        }
      }
    }
    return new ProblemInstance(contactIds, amounts);
  }
}
