import { Injectable } from '@angular/core';
import {ServerResponse} from "../Response/ServerResponse";
import {TransactionService} from "./transaction.service";
import {MatrixClientService} from "../CommunicationInterface/matrix-client.service";
import {ClientInterface} from "../CommunicationInterface/ClientInterface";

// TODO: delete later
class Currency {
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private transactionService: TransactionService;
  private matrixClientService: ClientInterface;

  private static readonly ROOM_VISIBILITY: "private";

  constructor(transactionService: TransactionService, matrixClientService: MatrixClientService) {
    this.transactionService = transactionService;
    this.matrixClientService = matrixClientService;
  }

  public addMember(groupId: string, userId: string): ServerResponse {
    return ServerResponse.makeStandardRequest(
      this.matrixClientService.getClient().inviteUserToGroup(groupId, userId));
  }

  public confirmRecommendation(groupId: string, recommendationId: number): ServerResponse {
    // TODO: seperate into private methods and avoid magic numbers
    let client = this.matrixClientService.getClient();

    // Part 1: Find the right recommendation
    let accountDataEvents = client.getRoom(groupId)["account_data"]["events"];
    let recommendations = null;

    for (let event of accountDataEvents["type"]) {
      if (event["type"] == "recommendations") {
        recommendations = event;
      }
    }

    if (recommendations == null) {
      return new ServerResponse(false, "recommendation not found");
    }

    if (!Number.isInteger(recommendationId) || recommendationId < 0
      || recommendationId >= recommendations["amounts"].length) {
      return new ServerResponse(false, "invalid recommendation id");
    }

    // Part 1.5: Read data from Recommendation
    let recipient = recommendations["recipients"][recommendationId];
    let payer = recommendations["payers"][recommendationId];
    let amount = recommendations["amounts"][recommendationId];

    if (payer != client.getUserId()) {
      return new ServerResponse(false, "user not payer of recommendation");
    }

    // Part 2: Create Payback
    let transaction = this.createTransaction(groupId, "Payback", payer, [recipient], [amount]);
    if (!transaction.wasSuccessful()) {
      return transaction;
    }

    // Part 3: delete Recommendation
    recommendations.splice(recommendationId, 1);
    return ServerResponse.makeStandardRequest(client.setRoomAccountData(groupId, "recommendations", recommendations));
  }

  public createGroup(name: string, currency: Currency): ServerResponse {
    let client = this.matrixClientService.getClient();

    let options = {
      "room_alias_name": "",
      "visibility": GroupService.ROOM_VISIBILITY,
      "invite": [],
      "name": name,
      "topic": ""
    }

    let room = client.createRoom(options);
    if (!room.wasSuccessful()) {
      return room;
    }

    // TODO: not sure if this is the way to send a state event...
    return ServerResponse.makeStandardRequest(
      client.sendEvent(room["room_id"], "currency", currency));
  }

  public createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): ServerResponse {
    return this.transactionService.createTransaction(groupId, description, payerId, recipientIds, amounts);
  }

  public fetchHistory(groupId: string): ServerResponse {
    // TODO: implementation unclear. Is syncing already being done automatically in background (-> UpdateService would see this)
    return undefined;
  }

  public leaveGroup(groupId: string): ServerResponse {
    let client = this.matrixClientService.getClient();

    // TODO: check if balance in that group is zero in order to be allowed to leave.
    // There should be a better way to do this
    let accountDataEvents = client.getRoom(groupId)["account_data"]["events"];
    let allowedToLeave: boolean = false;

    for (let event of accountDataEvents) if (event["type"] == "balances") {
      event["content"]["contacts"].forEach(function (element, index) {
        if (element == client.getUserId() && event["content"]["balances"][index] == 0) {
          allowedToLeave = true;
        }
      })
    }

    return ServerResponse.makeStandardRequest(
      this.matrixClientService.getClient().leaveGroup(groupId));
  }

  public modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string,
                           recipientIds: string[], amounts: number[]): ServerResponse {
    return this.transactionService.modifyTransaction(groupId, transactionId, description, payerId, recipientIds, amounts);
  }
}
