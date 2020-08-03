import { Injectable } from '@angular/core';
import {User} from './User/User';
import {Status} from './Status/Status';
import {Group} from './Group/Group';

@Injectable({
  providedIn: 'root'
})
export class DataModelService {

  constructor() { }
  private user: User;
  private status: Status;

  public getGroups(): Group[] {
    return this.user.groups;
  }

  public getGroup(groupId: string): Group { // TODO: implement it. DONE
    return this.user.getGroup(groupId);
  }

  public getStatus(): Status {
    return this.status;
  }
}
