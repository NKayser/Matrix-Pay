import { Component, OnInit } from '@angular/core';
import {DataModelService} from '../../DataModel/data-model.service';
import {Activity} from '../../DataModel/Group/Activity';
import {ActivityType} from '../../DataModel/Group/ActivityType';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  activities: Activity[] = [];
  activityTypes = ActivityType;

  constructor(private dataModelService: DataModelService) {
  }

  /**
   * get reference to activities of groups merge and sort them
   */
  ngOnInit(): void {

    // TODO this method doesn't adds new activities automatically
    // Either check out other methods or implement a time that refreshes after a fixed time intervall
    const groups = this.dataModelService.getGroups();

    for (const group of groups){
      for (const activity of group.activities){
        this.activities.push(activity);
      }
    }

    this.sortByDate();
  }

  public fetchHistory(): void{

  }

  private getTime(date: Date): number {
    return date != null ? date.getTime() : 0;
  }


  private sortByDate(): void {
    this.activities.sort((a: Activity, b: Activity) => {
      return this.getTime(a.creationDate) - this.getTime(b.creationDate);
    });
  }

}
