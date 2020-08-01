import { Injectable } from '@angular/core';
import {ClientInterface} from "../CommunicationInterface/ClientInterface";
import {MatrixClientService} from "../CommunicationInterface/matrix-client.service";
import {ServerResponse} from "../Response/ServerResponse";

// TODO: delete later
class ObservableService {
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private matrixClientService: ClientInterface;
  private observableService: ObservableService;

  constructor(matrixClientService: MatrixClientService, observableService: ObservableService) {
    this.matrixClientService = matrixClientService;
    this.observableService = observableService;
  }

  public changeCurrency(currency: string): ServerResponse {
    return undefined;
  }

  public changeLanguage(language: string): ServerResponse {
    return undefined;
  }
}
