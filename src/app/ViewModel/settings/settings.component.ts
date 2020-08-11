import {Component, OnInit} from '@angular/core';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency, currencyMap} from '../../DataModel/Utils/Currency';
import {Language, languageMap} from '../../DataModel/Utils/Language';
import {SettingsService} from '../../ServerCommunication/SettingsCommunication/settings.service';
import {MatDialog} from '@angular/material/dialog';
import {ErrorModalComponent} from '../error-modal/error-modal.component';
import {promiseTimeout, TIMEOUT} from '../promiseTimeout';


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

  // track if matrix response is loading
  loadingLanguage = false;
  loadingCurrency = false;

  constructor(private dataModelService: DataModelService, private settingsService: SettingsService, public dialog: MatDialog) { }

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

      this.loadingLanguage = true;
      // TODO Discuss string format for languages

      promiseTimeout(TIMEOUT, this.settingsService.changeLanguage(this.selectedLanguage.toString())).then((data) => {
        console.log(data);
        if (!data.wasSuccessful()){
          this.openErrorModal('error language 1: ' + data.getMessage());
        }
        this.loadingLanguage = false;
      }, (err) => {
        this.openErrorModal('error language 2: ' + err);
        this.loadingLanguage = false;
      });
    }

    if (this.oldSelectedCurrency !== this.selectedCurrency){
      this.oldSelectedCurrency = this.selectedCurrency;

      this.loadingCurrency = true;
      // TODO Discuss string format for currencies
      promiseTimeout(TIMEOUT, this.settingsService.changeCurrency(this.selectedCurrency.toString())).then((data) => {
        if (!data.wasSuccessful()){
          this.openErrorModal('error currency 1: ' + data.getMessage());
        }
        this.loadingCurrency = false;
      }, (err) => {
        this.openErrorModal('error currency 2: ' + err);
        this.loadingCurrency = false;
      });
    }
  }

  private openErrorModal(message: string): void{
    this.dialog.open(ErrorModalComponent, {
      width: '300px',
      data: {errorMessage: message}
    });
  }
}
