import {ServerResponse} from '../ServerCommunication/Response/ServerResponse';

export const TIMEOUT = 1000000000;

// Rejects promise that is inputed, if it doesn't reject or resolve in the timeout timeframe
export function promiseTimeout(ms: number, promise: Promise<ServerResponse>): Promise<ServerResponse>{

  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise<ServerResponse>((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ]);
}
