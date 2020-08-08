import {ProblemInstance} from './problemInstance';
import {SolutionInstance} from './solutionInstance';

/**
 * Interface for interchangable algorithms that can solve the optimisation problem of calculating paybacks for a group.
 */
export interface OptimisationInterface {
  /**
   * calculates an optimal number of paybacks for a group.
   * @param problem  Problem instance for which the paybacks should be calculated.
   */
  calculateOptimisation(problem: ProblemInstance): SolutionInstance;
}
