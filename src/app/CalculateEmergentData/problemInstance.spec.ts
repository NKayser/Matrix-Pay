import {ProblemInstance} from './problemInstance';
import {SolutionInstance} from './solutionInstance';

describe('ProblemInstance', () => {

  it('should get values', () => {
    // Setup
    const payerIds = ['id01', 'id02', 'id03'];
    const recipientIds = ['id04', 'id05', 'id06'];
    const amounts = [105, 110, 115];
    const solution = new SolutionInstance(payerIds, recipientIds, amounts);

    // Actual
    expect(solution.getPayerIds()).toEqual(['id01', 'id02', 'id03']);
    expect(solution.getRecipientIds()).toEqual(['id04', 'id05', 'id06']);
    expect(solution.getAmounts()).toEqual([105, 110, 115]);
  });
});
