import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  activities: string[];

  constructor() {

    this.activities = ['Filler Message 1', 'Filler Message 2', 'wegwgg', 'qsuiofgqöweojeggjörl', 'Filler Message 1', 'Filler Message 2',
      'wegwgg', 'qsuiofgqöweojeggjörl', 'Filler Message 1', 'Filler Message 2', 'wegwgg', 'qsuiofgqöweojeggjörl'];

  }

  ngOnInit(): void {
  }

}
