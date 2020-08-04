import {ProblemInstance} from './problemInstance';
import {SolutionInstance} from './solutionInstance';

export interface OptimisationInterface {
  calculateOptimisation(problem: ProblemInstance): SolutionInstance;
}
