import { ServerResponse } from '../Response/ServerResponse';

export interface EmergentDataInterface {
  setBalances(groupId: string, balances: number[], contactsIds: string[]): ServerResponse;
  setRecommendations(groupId: string, amounts: number[], payerIds: string[], recipientIds: string[]): ServerResponse;
}
