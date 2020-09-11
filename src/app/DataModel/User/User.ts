import {Contact} from '../Group/Contact';
import {Currency} from '../Utils/Currency';
import {Language} from '../Utils/Language';
import {Group} from '../Group/Group';
import {Groupmember} from '../Group/Groupmember';
import {Subject} from 'rxjs';

/**
 * User of the application. The user is the person using this application right now.
 * It is linked with the user's contact and saves all the user's groups.
 */
export class User {
  private static _singleUser: User = null;
  private _contact: Contact;
  private _currency: Currency;
  private _language: Language;
  private _groups: Group[];

  private groupChangeEmitter: Subject<void> = new Subject<void>();

  public getGroupChangeEmitter(): Subject<void> {
    return this.groupChangeEmitter;
  }

  /**
   * Constructor for user. In addition to setting the values given by the arguments, groups is initialized as an empty array and the user
   * itself is made singleton object of the Class User.
   * @param contact  Contact of the person using the application.
   * @param currency  Preferred currency of the user.
   * @param language  Language of the user.
   */
  constructor(contact: Contact, currency: Currency, language: Language) {
    this._contact = contact;
    this._currency = currency;
    this._language = language;
    this._groups = [];
    User._singleUser = this;
  }

  /**
   * Returns the singleton user object.
   */
  static get singleUser(): User {
    return this._singleUser;
  }

  /**
   * Returns the user's contact.
   */
  get contact(): Contact {
    return this._contact;
  }

  /**
   * Sets the user's contact.
   * @param value  New contact.
   */
  set contact(value: Contact) {
    this._contact = value;
  }

  /**
   * Returns the user's currency.
   */
  get currency(): Currency {
    return this._currency;
  }

  /**
   * Sets the user's currency.
   * @param value  New currency.
   */
  set currency(value: Currency) {
    this._currency = value;
  }

  /**
   * Returns the user's language.
   */
  get language(): Language {
    return this._language;
  }

  /**
   * Sets the user's language.
   * @param value  New language.
   */
  set language(value: Language) {
    this._language = value;
  }

  /**
   * Returns an array holding the user's groups.
   */
  get groups(): Group[] {
    return this._groups;
  }

  /**
   * Returns a specific group specified by group ID of the user.
   * @param groupId  ID of the group that should be returned.
   */
  public getGroup(groupId: string): Group { // TODO: implement it. DONE
    for (const group of this.groups) {
      if (group.groupId === groupId) {return group; }
    }
    return null;
  }

  /**
   * Creates a new group for the user. Adds the group to the user's groups. Adds the user to the group's groupmembers.
   * @param groupId  ID of the new group.
   * @param name  Name of the new group.
   * @param currency  Currency of the new group.
   */
  public createGroup(groupId: string, name: string, currency: Currency): Group {
    const group: Group = new Group(groupId, name, currency);
    this._groups.push(group);
    // group.addGroupmember(new Groupmember(this._contact, group));
    this.groupChangeEmitter.next();
    return group;
  }

  /**
   * Removes a group from the array of groups of the user.
   * @param groupId  ID of he group that should be removed.
   */
  public removeGroup(groupId: string): void{
    this._groups.forEach( (item, index) => {
      if (item.groupId === groupId) { this._groups.splice(index, 1); }
    });
  }

  public deleteAllGroups(): void {
    this._groups = [];
  }
}
