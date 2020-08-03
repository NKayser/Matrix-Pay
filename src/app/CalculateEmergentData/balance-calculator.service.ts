import { Injectable } from '@angular/core';
import {ProblemInstance} from './problemInstance';
// as soon as available, import Transaction from DataModel
// import {Transaction} from './DataModel/Transaction'

@Injectable({
  providedIn: 'root'
})
export class BalanceCalculatorService {

  constructor() { }

  // to be implemented: calculation of balances
  calculateBalances(oldBalances: Map<string, number>, lastDate: Date /*,transactions: Transaction[*/): ProblemInstance {
    return new ProblemInstance(['a', 'b'], [1, 2]);
  }
}
