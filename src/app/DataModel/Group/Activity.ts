import {ActivityType} from './ActivityType';
import {Transaction} from './Transaction';
import {Group} from './Group';
import {Contact} from './Contact';

export class Activity {
  private readonly _activityType: ActivityType;
  private readonly _subject: Transaction | Group;
  private readonly _actor: Contact;
  private readonly _creationDate: Date;

  public constructor(activityType: ActivityType, subject: Transaction | Group, actor: Contact, creationDate: Date) {
    this._activityType = activityType;
    this._subject = subject;
    this._actor = actor;
    this._creationDate = creationDate;
  }

  get activityType(): ActivityType {
    return this._activityType;
  }

  get subject(): Transaction | Group {
    return this._subject;
  }

  get actor(): Contact {
    return this._actor;
  }

  get creationDate(): Date {
    return this._creationDate;
  }
}
