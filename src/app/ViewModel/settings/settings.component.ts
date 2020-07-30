import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  selectedLanguage = 'english';
  selectedCurrency = 'euro';

  constructor() { }

  ngOnInit(): void {
  }

  currencyChanged(): void {
    console.log('currency');
  }

  languageChanged(): void{
    console.log('language');
  }

}
