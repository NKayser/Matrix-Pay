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
  setAccountData(eventType: string, contents: any, callback?: (res: object, err: object) => void): Promise<object>;
  getAccountDataFromServer(eventType: string, contents: any, callback?: (res: object, err: object) => void): Promise<MatrixEvent>;
  sendEvent(roomId: string, eventType: string, content: object, txnId?: string, callback?: (res: object, err: object) => void): Promise<any>;
  fetchRoomEvent(roomId: string, eventId: string, callback?: (res: object, err: object) => void): Promise<object>;
  getJoinedRoomMembers(roomId: string): Promise<string[]>;
  setRoomAccountData(roomId: string, eventType: string, content: object, callback?: (res: object, err: object) => void): Promise<any>;
  inviteUserToGroup(groupId: string, userId: string): Promise<any>;
  sendStateEvent(roomId: string, eventType: string, content: object, stateKey: string, callback): Promise<any>;
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
