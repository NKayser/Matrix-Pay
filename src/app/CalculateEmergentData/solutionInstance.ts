// as soon available import Recommendation from DataModel
// import {Recommendation} from './DataModel/Recommendation';
export class SolutionInstance {
  private payerIds: string[];
  private recipientIds: string[];
  private amounts: number[];

  constructor(payerIds: string[], recipientIds: string[], amounts: number[]) {
    this.payerIds = payerIds;
    this.recipientIds = recipientIds;
    this.amounts = amounts;
  }

  getPayerIds(): string[] {
    return this.payerIds;
  }

  getRecipientIds(): string[] {
    return this.recipientIds;
  }

  getAmounts(): number[] {
    return this.amounts;
  }
}
