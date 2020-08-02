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
    let client = this.matrixClientService.getClient();

    if (client.isLoggedIn != true) {
      return new ServerResponse(false, ServerResponse.LOGGED_OUT);
    }

    client.setAccountData(SettingsService.CURRENCY_CONTENT_KEY, currency)
      .then((val) => {
        return new ServerResponse(true);
      })
      .catch((reason) => {
        return new ServerResponse(false, reason);
      });

    return new ServerResponse(false, ServerResponse.UNKNOWN);
  }

  public changeLanguage(language: string): ServerResponse {
    let client = this.matrixClientService.getClient();

    if (client.isLoggedIn != true) {
      return new ServerResponse(false, ServerResponse.LOGGED_OUT);
    }

    client.setAccountData(SettingsService.LANGUAGE_CONTENT_KEY, language)
      .then((val) => {
        return new ServerResponse(true);
      })
      .catch((reason) => {
        return new ServerResponse(false, reason);
      });

    return new ServerResponse(false, ServerResponse.UNKNOWN);
  }
}
