import { Injectable } from '@angular/core';
import {EmergentDataInterface} from './EmergentDataInterface';
import {ServerResponse} from '../Response/ServerResponse';
// @ts-ignore
import {MatrixClient} from 'matrix-js-sdk';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
import {ClientInterface} from './ClientInterface';
import {MatrixClientService} from './matrix-client.service';

@Injectable({
  providedIn: 'root'
})
export class MatrixEmergentDataService implements EmergentDataInterface {
  private clientService: ClientInterface;

  private static BALANCES_EVENT_TYPE: string = 'com.matrixpay.balances';
  private static RECOMMENDATIONS_EVENT_TYPE: string = 'com.matrixpay.recommendations';

  constructor(clientService: MatrixClientService) {
    this.clientService = clientService;
  }

  public async setBalances(groupId: string, balances: number[], contactsIds: string[], lastTransactionId: string): Promise<ServerResponse> {
    const client: MatrixClient = this.clientService.getClient();

    // Create the balances content object
    const content: object = {
      'balances': balances,
      'contacts': contactsIds,
      'last_transaction': lastTransactionId
    }

    // Set AccountData of the balance type
    await client.setRoomAccountData(groupId, MatrixEmergentDataService.BALANCES_EVENT_TYPE, content);
    return new SuccessfulResponse(); // any errors are unexpected and will be uncaught
  }

  public async setRecommendations(groupId: string, amounts: number[], payerIds: string[], recipientIds: string[],
                                  lastTransactionId: string): Promise<ServerResponse> {
    const client: MatrixClient = this.clientService.getClient();

    // Create the recommendations content object
    const content: object = {
      'recipients': recipientIds,
      'payers': payerIds,
      'amounts': amounts,
      'last_transaction': lastTransactionId
    }

    // Set AccountData of the balance type
    await client.setRoomAccountData(groupId, MatrixEmergentDataService.RECOMMENDATIONS_EVENT_TYPE, content);
    return new SuccessfulResponse(); // any errors are unexpected and will be uncaught
  }
}
