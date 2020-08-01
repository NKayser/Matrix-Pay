interface EmergentDataInterface {
  setBalances(groupId: string, balances: number[], contactsIds: string[]): Response;
  setRecommendations(groupId: string, amounts: number[], payerIds: string[], recipientIds: string[]): Response;
}
