import {Contact} from "../Group/Contact";
import {Currency} from "../Utils/Currency";
import {Language} from "../Utils/Language";
import {Group} from "../Group/Group";
import {Groupmember} from "../Group/Groupmember";

export class User {
  private static readonly _singleUser: User;
  private readonly _contact: Contact;
  private _currency: Currency;
  private _language: Language;
  private _groups: Group[];

  constructor(contact: Contact, currency: Currency, language: Language) {
    this._contact = contact;
    this._currency = currency;
    this._language = language;
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

  get language(): Language {
    return this._language;
  }

  get groups(): Group[] {
    return this._groups;
  }

  public getGroup(groupId: string): Group { //TODO: implement it.
    return null;
  };

  public createGroup(groupId: string, name: string, currency: Currency): Group {
    let group: Group = new Group(groupId, name, currency);
    this._groups.push(group);
    group.addGroupmember(new Groupmember(this._contact, group));
    return group;
  }

  set currency(value: Currency) {
    this._currency = value;
  }

  set language(value: Language) {
    this._language = value;
  }
}
