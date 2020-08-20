import { SettingsService } from './settings.service';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';

describe('SettingsServiceService', () => {
  let service: SettingsService;
  const clientServiceSpy = jasmine.createSpyObj('MatrixClientService', ['getClient']);

  beforeEach(() => {
    service = new SettingsService(clientServiceSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
