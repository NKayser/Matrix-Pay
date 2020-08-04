import {Group} from './Group';
import {AtomarChange} from './AtomarChange';

export class Recommendation {
  private readonly _group: Group;
  private readonly _payer: AtomarChange;
  private readonly _recipient: AtomarChange;

  public constructor(group: Group, payer: AtomarChange, recipient: AtomarChange) {
    this._group = group;
    this._payer = payer;
    this._recipient = recipient;
  }

  get group(): Group {
    return this._group;
  }

  get payer(): AtomarChange {
    return this._payer;
  }

  get recipient(): AtomarChange {
    return this._recipient;
  }
}
