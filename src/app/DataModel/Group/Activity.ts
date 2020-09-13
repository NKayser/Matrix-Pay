import {ActivityType} from './ActivityType';
import {Transaction} from './Transaction';
import {Group} from './Group';
import {Contact} from './Contact';

/**
 * An activity generated to show changes to the user.
 */
export class Activity {
  private readonly _activityType: ActivityType;
  private readonly _subject: Transaction | Group;
  private readonly _actor: Contact;
  private readonly _creationDate: Date;

  /**
   * constructor for Activity.
   * @param activityType  Type of the Activity.
   * @param subject  Subject of the Activity. can be either a transaction or a group.
   * @param actor  Contact of the person who caused the change.
   * @param creationDate  Date when the change occurred.
   */
  public constructor(activityType: ActivityType, subject: Transaction | Group, actor: Contact, creationDate: Date) {
    this._activityType = activityType;
    this._subject = subject;
    this._actor = actor;
    this._creationDate = creationDate;
  }

  /**
   * Returns the activity type.
   */
  get activityType(): ActivityType {
    return this._activityType;
  }

  /**
   * Returns the subject of the activity. This can be either a transaction or a group.
   */
  get subject(): Transaction | Group {
    return this._subject;
  }

  /**
   * Returns the contact of the person who caused the change.
   */
  get actor(): Contact {
    return this._actor;
  }

  /**
   * Returns the Date when the change happened.
   */
  get creationDate(): Date {
    return this._creationDate;
  }
}
