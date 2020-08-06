export class BalancesType {
  groupId: string;
  balances: number[];
  participantIds: string[];

  constructor(groupId: string, balances: number[], participantIds: string[]) {
    this.groupId = groupId;
    this.balances = balances;
    this.participantIds = participantIds;
  }
}

export class RecommendationsType {
  groupId: string;
  amounts: number[];
  receiverIds: string[];

  constructor(groupId: string, amounts: number[], receiverIds: string[]) {
    this.groupId = groupId;
    this.amounts = amounts;
    this.receiverIds = receiverIds;
  }
}

export class GroupsType {
  groupId: string;
  groupName: string;
  userIds: string[];
  userNames: string[];
  isLeave: boolean;

  constructor(groupId: string, groupName: string, userIds: string[], userNames: string[], isLeave: boolean) {
    this.groupId = groupId;
    this.groupName = groupName;
    this.userIds = userIds;
    this.userNames = userNames;
    this.isLeave = isLeave;
  }

}

export class GroupMemberType{
  groupId: string;
  userId: string;
  names: string[];
  date: Date;

  constructor(groupId: string, userId: string, names: string[], date: Date) {
    this.groupId = groupId;
    this.userId = userId;
    this.names = names;
    this.date = date;
  }
}
