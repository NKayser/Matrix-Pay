import {Component, OnInit} from '@angular/core';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {DataModelService} from '../../DataModel/data-model.service';
import {currencyMap} from '../../DataModel/Utils/Currency';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  balances: number[] = [5, 10, 0, 5, 6];

  recommendations: Recommendation[] = [];
  currencyMap = currencyMap;

  constructor(private dataModelService: DataModelService) {}

  ngOnInit(): void {

    const groups = this.dataModelService.getGroups();
    for (const group of groups){
      for (const recommendation of group.recommendations){
        this.recommendations.push(recommendation);
      }
    }
  }

  // Calculate the total Balances of the User
  public getTotalBalance(): number{
    // TODO Remove this
    const total = 0;
    /*for (let i = 0; i < this.balance.length; i++){
      total += this.balance[i];
    }*/
    return total;
    // TODO Add loop to calculate all Balances
  }

  public confirmPayback(payerId: string, recipientId: string, amount: number): void{

  }

}
