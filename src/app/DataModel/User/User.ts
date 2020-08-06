import {Contact} from '../Group/Contact';
import {Currency} from '../Utils/Currency';
import {Language} from '../Utils/Language';
import {Group} from '../Group/Group';
import {Groupmember} from '../Group/Groupmember';

export class User {
  private static _singleUser: User;
  private readonly _contact: Contact;
  private _currency: Currency;
  private _language: Language;
  private _groups: Group[];

  constructor(contact: Contact, currency: Currency, language: Language) {
    this._contact = contact;
    this._currency = currency;
    this._language = language;
    this._groups = [];
    User._singleUser = this;
  }

  static get singleUser(): User {
    return this._singleUser;
  }

  get contact(): Contact {
    return this._contact;
  }

  get currency(): Currency {
    return this._currency;
  }

  set currency(value: Currency) {
    this._currency = value;
  }

  get language(): Language {
    return this._language;
  }

  set language(value: Language) {
    this._language = value;
  }

  get groups(): Group[] {
    return this._groups;
  }

  public getGroup(groupId: string): Group { // TODO: implement it. DONE
    for (const group of this.groups) {
      if (group.groupId === groupId) {return group; }
    }
    return null;
  }

  public createGroup(groupId: string, name: string, currency: Currency): Group {
    const group: Group = new Group(groupId, name, currency);
    this._groups.push(group);
    group.addGroupmember(new Groupmember(this._contact, group));
    return group;
  }
}
