import { Injectable } from '@angular/core';
import {ClientInterface} from '../CommunicationInterface/ClientInterface';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ServerResponse} from '../Response/ServerResponse';

// TODO: delete later
class ObservableService {
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private matrixClientService: ClientInterface;
  private observableService: ObservableService;

  private static readonly CURRENCY_CONTENT_KEY: string = 'currency';
  private static readonly LANGUAGE_CONTENT_KEY: string = 'language';

  constructor(matrixClientService: MatrixClientService, observableService: ObservableService) {
    this.matrixClientService = matrixClientService;
    this.observableService = observableService;
  }

  public changeCurrency(currency: string): ServerResponse {
    return ServerResponse.makeStandardRequest(
      this.matrixClientService.getClient().setAccountData(SettingsService.CURRENCY_CONTENT_KEY, currency));
  }

  public changeLanguage(language: string): ServerResponse {
    return ServerResponse.makeStandardRequest(
      this.matrixClientService.getClient().setAccountData(SettingsService.LANGUAGE_CONTENT_KEY, language));
  }
}
