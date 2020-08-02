import { Injectable } from '@angular/core';
import {OptimisationInterface} from './optimisationInterface';
import {ProblemInstance} from './problemInstance';
import {SolutionInstance} from './solutionInstance';

@Injectable({
  providedIn: 'root'
})
export class GreedyOptimisationService implements OptimisationInterface{

  constructor() { }

  // to be implemented: optimisation algorithm
  calculateOptimisation(problem: ProblemInstance): SolutionInstance {
    return new SolutionInstance('abc');
  }
}
