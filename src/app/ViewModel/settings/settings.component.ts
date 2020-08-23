import {Component, OnInit} from '@angular/core';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency, currencyMap, matrixCurrencyMap} from '../../DataModel/Utils/Currency';
import {MatDialog} from '@angular/material/dialog';
import {promiseTimeout, TIMEOUT} from '../promiseTimeout';
import {DialogProviderService} from '../dialog-provider.service';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // save the current language and currency
  // public selectedLanguage = Language.ENGLISH;
  public selectedCurrency = Currency.USD;

  // these variables are there to save changes to the settings, so only changed settings need to be send to matrix
  // private oldSelectedLanguage: Language;
  private oldSelectedCurrency: Currency;

  // load mappings
  public currencyMap = currencyMap;
  // public languageMap = languageMap;

  // track if matrix response is loading
  // public loadingLanguage = false;
  public loadingCurrency = false;

  constructor(private dataModelService: DataModelService, private matrixBasicDataService: MatrixBasicDataService, public dialog: MatDialog,
              private dialogProviderService: DialogProviderService) { }

  ngOnInit(): void {
    this.initSettings();
  }

  // initialise the setting values
  private initSettings(): void{

    // get current setting values from dataModel
    // this.selectedLanguage = this.dataModelService.getUser().language;
    this.selectedCurrency = this.dataModelService.getUser().currency;

    this.oldSelectedCurrency = this.selectedCurrency;
    // this.oldSelectedLanguage = this.selectedLanguage;

  }

  /**
   * Apply all changed settings by sending them to matrix
   */
  public applySettings(): void{
    /*if (this.oldSelectedLanguage !== this.selectedLanguage){
      this.oldSelectedLanguage = this.selectedLanguage;

      this.loadingLanguage = true;

      promiseTimeout(TIMEOUT, this.matrixBasicDataService.userChangeLanguage(this.selectedLanguage.toString())).then((data) => {
        if (!data.wasSuccessful()){
          this.dialogProviderService.openErrorModal('error language 1: ' + data.getMessage(), this.dialog);
        }
        this.loadingLanguage = false;
      }, (err) => {
        this.dialogProviderService.openErrorModal('error language 2: ' + err, this.dialog);
        this.loadingLanguage = false;
      });
    }*/

    if (this.oldSelectedCurrency !== this.selectedCurrency){
      this.oldSelectedCurrency = this.selectedCurrency;

      this.loadingCurrency = true;
      promiseTimeout(TIMEOUT, this.matrixBasicDataService.userChangeDefaultCurrency(
        matrixCurrencyMap[this.selectedCurrency])).then((data) => {
        if (!data.wasSuccessful()){
          this.dialogProviderService.openErrorModal('error currency 1: ' + data.getMessage(), this.dialog);
        }
        this.loadingCurrency = false;
      }, (err) => {
        this.dialogProviderService.openErrorModal('error currency 2: ' + err, this.dialog);
        this.loadingCurrency = false;
      });
    }
  }
}
