// as soon available import Recommendation from DataModel
// import {Recommendation} from './DataModel/Recommendation';
export class SolutionInstance {
  private payerIds: string[];
  private recipiantIds: string[];
  private amounts: number[];

  constructor(payerIds: string[], recipiantIds: string[], amounts: number[]) {
    this.payerIds = payerIds;
    this.recipiantIds = recipiantIds;
    this.amounts = amounts;
  }

  getPayerIds(): string[] {
    return this.payerIds;
  }

  getRecipiantIds(): string[] {
    return this.recipiantIds;
  }

  getAmounts(): number[] {
    return this.amounts;
  }
}
