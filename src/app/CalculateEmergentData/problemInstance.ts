import {Groupmember} from '../DataModel/Group/Groupmember';

/**
 * Problem Instance for the optimization algorithm.
 */
export class ProblemInstance {
  private contactIds: string[];
  private amounts: number[];

  /**
   * Constructor for ProblemInstance. Turns an array of gruopmembers into two arrays containig contact IDs and amounts.
   * @param groupmembers  An array of groupmembers of the group of which the optimal paybacks should be created.
   */
  constructor(groupmembers: Groupmember[]) {
    this.contactIds = [];
    this.amounts = [];
    for (const groupmember of groupmembers) {
      this.contactIds.push(groupmember.contact.contactId);
      this.amounts.push(groupmember.balance);
    }
  }

  /**
   * Returns an array of User IDs.
   */
  getUsers(): string[] {
    return this.contactIds;
  }

  /**
   * Returns the balance of a specific user.
   * @param index  position in the array.
   */
  getBalanceForUser(index: number): number {
    return this.amounts[index];
  }

  /**
   * Returns an array holding all balances.
   */
  getBalances(): number[] {
    return this.amounts;
  }
}
