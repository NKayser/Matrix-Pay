import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  balance: number;
  currencySymbol: string;

  constructor() {

    this.balance = -50.34;
    this.currencySymbol = '€';

  }

  ngOnInit(): void {
  }

}
