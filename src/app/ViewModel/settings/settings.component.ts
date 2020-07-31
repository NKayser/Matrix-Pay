import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // save the current language and currency
  selectedLanguage = 'english';
  selectedCurrency = 'euro';

  constructor() { }

  ngOnInit(): void {
    this.initSettings();
  }

  // initialise the setting values
  initSettings(): void{

  }

  // update Matrix-Settings when the user changes the currency
  currencyChanged(): void {
    console.log('currency');
  }

  // update Matrix-Settings when the user changes the language
  languageChanged(): void{
    console.log('language');
  }

}
