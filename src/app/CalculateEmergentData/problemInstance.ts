export class ProblemInstance {
  private users: string[];
  private balances: number[];

  constructor(users: string[], balances: number[]) {
    this.users = users;
    this.balances = balances;
  }

  getUsers(): string[] {
    return this.users;
  }

  getBalanceForUser(index: number): number {
    return this.balances[index];
  }
}
