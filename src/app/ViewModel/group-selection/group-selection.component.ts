import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-group-selection',
  templateUrl: './group-selection.component.html',
  styleUrls: ['./group-selection.component.css']
})
export class GroupSelectionComponent implements OnInit{

  groupName: string;

  // this is an array of group names, which gets displayed by the view
  // this should get read from the dataService
  groups = ['Group1', 'Group2', 'Group3'];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  // set default selected group
  ngOnInit(): void{
    this.groupName = this.groups[0];
  }

  // Select a specific group and change the view accordingly
  selectGroup(index: number): void{
    this.groupName = this.groups[index];
  }

}
