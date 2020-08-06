import {EventEmitter} from 'events';

declare module 'matrix-js-sdk';

declare class AutoDiscovery {
  findClientConfig(domain: string): Promise<DiscoveredClientConfig>;
}

declare class DiscoveredClientConfig {
  "m.homeserver": {
    "state": string,
    "error": string,
    "base_url": string,
  };
}


declare class MatrixClient extends EventEmitter {
  setAccountData(eventType: string, contents: any, callback: boolean): Promise<any>;
  getAccountDataFromServer(eventType: string, contents: any, callback: boolean): Promise<MatrixEvent>;
}

declare class MatrixEvent {
  "event": {
    "type": string,
    "content": object
  };
  "sender": string;
  "target": string;
  "status": string;
  "error": string;
}
