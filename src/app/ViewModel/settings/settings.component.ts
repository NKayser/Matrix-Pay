import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // save the current language and currency
  selectedLanguage = 'english';
  selectedCurrency = 'euro';

  oldSelectedLanguage: string;
  oldSelectedCurrency: string;

  constructor() { }

  ngOnInit(): void {
    this.initSettings();
  }

  // initialise the setting values
  initSettings(): void{

    this.oldSelectedCurrency = this.selectedCurrency;
    this.oldSelectedLanguage = this.selectedLanguage;

  }

  public getCurrency(): void {

  }

  public getLanguage(): void {

  }

  // correspondes to the changeDefaultCurrency() and changeDefaultLanguage from the PhasenberichtEntwurf
  applySettings(): void{
    if (this.oldSelectedLanguage !== this.selectedLanguage){
      this.oldSelectedLanguage = this.selectedLanguage;
      console.log(this.selectedLanguage);
    }
    if (this.oldSelectedCurrency !== this.selectedCurrency){
      this.oldSelectedCurrency = this.selectedCurrency;
      console.log(this.selectedCurrency);
    }
  }



}
