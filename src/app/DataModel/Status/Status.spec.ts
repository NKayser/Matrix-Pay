import {Status} from './Status';
import {SuccessfulResponse} from '../../ServerCommunication/Response/SuccessfulResponse';
import {UnsuccessfulResponse} from '../../ServerCommunication/Response/UnsuccessfulResponse';

describe('Status', () => {

  it('check values', () => {

    const s1 = new Status();

    const sr1 = new SuccessfulResponse();
    const sr2 = new UnsuccessfulResponse();

    expect(s1.responses).toEqual([]);
    s1.newResponse(sr1);
    expect(s1.responses).toEqual([sr1]);
    s1.newResponse(sr2);
    expect(s1.responses).toEqual([sr1, sr2]);


  });
});
