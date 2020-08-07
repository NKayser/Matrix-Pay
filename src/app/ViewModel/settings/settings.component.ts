import {Component, OnInit} from '@angular/core';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency, currencyMap} from '../../DataModel/Utils/Currency';
import {Language, languageMap} from '../../DataModel/Utils/Language';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // save the current language and currency
  selectedLanguage = Language.ENGLISH;
  selectedCurrency = Currency.USD;

  // these variables are there to save changes to the settings, so only changed settings need to be send to matrix
  oldSelectedLanguage: Language;
  oldSelectedCurrency: Currency;

  // load mappings
  currencyMap = currencyMap;
  languageMap = languageMap;

  constructor(private dataModelService: DataModelService) { }

  ngOnInit(): void {
    this.initSettings();
  }

  // initialise the setting values
  initSettings(): void{

    // get current setting values from dataModel
    this.selectedLanguage = this.dataModelService.getUser().language;
    this.selectedCurrency = this.dataModelService.getUser().currency;

    this.oldSelectedCurrency = this.selectedCurrency;
    this.oldSelectedLanguage = this.selectedLanguage;

  }

  // corresponds to the changeDefaultCurrency() and changeDefaultLanguage from the PhasenberichtEntwurf
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
