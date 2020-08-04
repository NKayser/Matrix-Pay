export class ProblemInstance {
  private contactIds: string[];
  private amounts: number[];

  constructor(contactIds: string[], amounts: number[]) {
    this.contactIds = contactIds;
    this.amounts = amounts;
  }

  getUsers(): string[] {
    return this.contactIds;
  }

  getBalanceForUser(index: number): number {
    return this.amounts[index];
  }

  getBalances(): number[] {
    return this.amounts;
  }
}
