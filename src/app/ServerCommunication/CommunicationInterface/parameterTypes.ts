import {Currency} from "../../DataModel/Utils/Currency";
import {Language} from "../../DataModel/Utils/Language";
import {Group} from "../../DataModel/Group/Group";
import {AtomarChange} from "../../DataModel/Group/AtomarChange";
import {Groupmember} from "../../DataModel/Group/Groupmember";

export interface UserType {
  contactId: string;
  name: string;
  currency: string;
  language: string;
}

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
  currency: string;
  userIds: string[];
  userNames: string[];
  isLeave: boolean;
}

export interface GroupMemberType{
  groupId: string;
  userId: string;
  name: string;
  isLeave: boolean;
  date: Date;
}

export interface CurrencyType{
  currency: string;
}

export interface TransactionType{
  transactionType: string;
  transactionId: string;
  name: string;
  creationDate: Date;
  groupId: string,
  payerId: string,
  payerAmount: number;
  recipientIds: string[];
  recipientsAmounts: string[];
  senderId: string;
}
