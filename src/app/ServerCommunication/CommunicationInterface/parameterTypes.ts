export interface BalancesType {
  groupId: string;
  balances: number[];
  participantIds: string[];
}

export interface RecommendationsType {
  groupId: string;
  amounts: number[];
  payerIds: string[];
  receiverIds: string[];
}

export interface GroupsType {
  groupId: string;
  groupName: string;
  userIds: string[];
  userNames: string[];
  isLeave: boolean;
}

export interface GroupMemberType{
  groupId: string;
  userId: string;
  names: string[];
  date: Date;
}

export interface CurrencyType{
  currency: string;
}
