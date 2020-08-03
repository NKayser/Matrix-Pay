import {Group} from "./Group";
import {AtomarChange} from "./AtomarChange";

export class Recommendation {
  private readonly _group: Group;
  private readonly _payer: AtomarChange;
  private readonly _recipiant: AtomarChange;

  public constructor(group: Group, payer: AtomarChange, recipiant: AtomarChange) {
    this._group = group;
    this._payer = payer;
    this._recipiant = recipiant;
  }

  get group(): Group {
    return this._group;
  }

  get payer(): AtomarChange {
    return this._payer;
  }

  get recipiant(): AtomarChange {
    return this._recipiant;
  }
}
