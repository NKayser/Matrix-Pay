/**
 * Solution instance that is calculated by the optimisation algorithm.
 */
export class SolutionInstance {
  private payerIds: string[];
  private recipientIds: string[];
  private amounts: number[];

  /**
   * Constructor for SolutionInstance
   * @param payerIds  Array holding payer IDs.
   * @param recipientIds  Array holding recipient IDs.
   * @param amounts  Array holding amounts of the recommended paybacks.
   */
  constructor(payerIds: string[], recipientIds: string[], amounts: number[]) {
    this.payerIds = payerIds;
    this.recipientIds = recipientIds;
    this.amounts = amounts;
  }

  /**
   * Returns an array of payer IDs of the recommended paybacks.
   */
  getPayerIds(): string[] {
    return this.payerIds;
  }

  /**
   * Returns an array of recipient IDs of the recommended paybacks.
   */
  getRecipientIds(): string[] {
    return this.recipientIds;
  }

  /**
   * Returns an array of amounts of the recommended paybacks.
   */
  getAmounts(): number[] {
    return this.amounts;
  }
}
