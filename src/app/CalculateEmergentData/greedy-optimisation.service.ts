import { Injectable } from '@angular/core';
import {OptimisationInterface} from './optimisationInterface';
import {ProblemInstance} from './problemInstance';
import {SolutionInstance} from './solutionInstance';

@Injectable({
  providedIn: 'root'
})
export class GreedyOptimisationService implements OptimisationInterface{

  constructor() { }

  private static getMinIndex(balances: number[]): number { // Finds the index of the lowest balance
    let minIndex = 0;
    for (let i = 1; i < balances.length; i++) {
      if (balances[i] < balances[minIndex]) { minIndex = i; }
    }
    return minIndex;
  }

  private static getMaxIndex(balances: number[]): number { // Finds the index of the highest balance
    let maxIndex = 0;
    for (let i = 1; i < balances.length; i++) {
      if (balances[i] > balances[maxIndex]) { maxIndex = i; }
    }
    return maxIndex;
  }

  // to be implemented: optimisation algorithm
  calculateOptimisation(problem: ProblemInstance): SolutionInstance {
    const solutionPayers: string[] = [];
    const solutionRecipients: string[] = [];
    const solutionAmounts: number[] = [];
    while (true) {
      const balances = problem.getBalances();
      const contactIds = problem.getUsers();
      const maxIndex = GreedyOptimisationService.getMaxIndex(balances);
      const minIndex = GreedyOptimisationService.getMinIndex(balances);
      if (balances[minIndex] === 0 && balances[maxIndex] === 0) {break; }
      const minAbsoluteValue = Math.min(-balances[minIndex], balances[maxIndex]);
      balances[maxIndex] -= minAbsoluteValue;
      balances[minIndex] += minAbsoluteValue;
      solutionPayers.push(contactIds[minIndex]);
      solutionRecipients.push(contactIds[maxIndex]);
      solutionAmounts.push(minAbsoluteValue);
    }
    return new SolutionInstance(solutionPayers, solutionRecipients, solutionAmounts);
  }
}
