import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private balance: number[] = new Array<number>(0);
  currencySymbol: string;

  constructor() {

    this.balance = [54, 65, 21];
    this.currencySymbol = '€';

  }

  ngOnInit(): void {
  }

  // Calculate the total Balances of the User
  getCurrentBalance(): number{
    // TODO Remove this
    const total = 0;
    /*for (let i = 0; i < this.balance.length; i++){
      total += this.balance[i];
    }*/
    return total;
    // TODO Add loop to calculate all Balances
  }

}
