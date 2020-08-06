import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-group-balance',
  templateUrl: './group-balance.component.html',
  styleUrls: ['./group-balance.component.css']
})
export class GroupBalanceComponent implements OnInit {

  // Input is used to pass the current selected group to the balance component
  @Input() group: string;

  data = [{name: 'Alice', value: 15}, {name: 'Bob', value: -5}, {name: 'Eve', value: -10}];

  getCustomColor = (name) => {
    for (const entry of this.data){
      if (entry.name === name){
        if (entry.value >= 0){
          return 'green';
        } else{
          return 'red';
        }
      }
    }
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  confirmPayback(payerId: string, recipientId: string, amount: number): void {

  }

  getBalances(): void{

  }

}
