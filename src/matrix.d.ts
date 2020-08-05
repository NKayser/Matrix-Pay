import {EventEmitter} from 'events';

declare module 'matrix-js-sdk';

declare class AutoDiscovery {
  findClientConfig(domain: string): Promise<DiscoveredClientConfig>;
}

declare class DiscoveredClientConfig {

}


declare class MatrixClient extends EventEmitter {
  "m.homeserver": {
    "state": string,
    "error": string,
    "base_url": string,
  };
}
