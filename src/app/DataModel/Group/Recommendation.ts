import {Group} from './Group';
import {AtomarChange} from './AtomarChange';

/**
 * Recommendation for a PAYBACK type transaction inside a group. Recommendations are calculated to enable easy payback between groupmembers.
 */
export class Recommendation {
  private readonly _group: Group;
  private readonly _payer: AtomarChange;
  private readonly _recipient: AtomarChange;

  /**
   * Constructor for Recommendation
   * @param group  Group in which the recommendation is.
   * @param payer  Recommended payer.
   * @param recipient  Recommended recipient.
   */
  public constructor(group: Group, payer: AtomarChange, recipient: AtomarChange) {
    this._group = group;
    this._payer = payer;
    this._recipient = recipient;
  }

  /**
   * Returns the group of the recommendation.
   */
  get group(): Group {
    return this._group;
  }

  /**
   * Returns the payer of the recommendation.
   */
  get payer(): AtomarChange {
    return this._payer;
  }

  /**
   * Returns the recipient of the recommendation.
   */
  get recipient(): AtomarChange {
    return this._recipient;
  }
}
