import { Component, OnInit, Input } from '@angular/core';
import {Group} from '../../DataModel/Group/Group';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {currencyMap} from '../../DataModel/Utils/Currency';

@Component({
  selector: 'app-group-balance',
  templateUrl: './group-balance.component.html',
  styleUrls: ['./group-balance.component.css']
})
export class GroupBalanceComponent implements OnInit {

  // Input is used to pass the current selected group to the balance component
  @Input() group: Group;

  currencyMap = currencyMap;

  recommendations: Recommendation[] = [];
  data = [];

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
    // Initializes the graph with the balances of the members
    const groupMembers = this.group.groupmembers;
    for (const groupMember of groupMembers){
      this.data.push({name: groupMember.contact.name, value: groupMember.balance});
    }

    // For some reason there is an empty element in the array by using the method above
    // By shifting the array, the first element gets removed
    this.data.shift();

    this.recommendations = this.group.recommendations;
  }

  confirmPayback(payerId: string, recipientId: string, amount: number): void {

  }

  getBalances(): void{

  }

}
