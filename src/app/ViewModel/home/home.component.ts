import {Component, OnInit} from '@angular/core';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency, currencyMap} from '../../DataModel/Utils/Currency';
import {Contact} from '../../DataModel/Group/Contact';
import {ConfirmPaybackDialogData, ConfirmPaybackModalComponent} from '../confirm-payback-modal/confirm-payback-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Utils} from '../../ServerCommunication/Response/Utils';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {openErrorModal, promiseTimeout, TIMEOUT} from '../promiseTimeout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public usedCurrencies: Set<Currency> = new Set();
  public recommendations: Recommendation[] = [];
  public currencyMap = currencyMap;

  public loadingConfirmPayback = false;

  private userContact: Contact;
  private dialogData: ConfirmPaybackDialogData;

  constructor(private dataModelService: DataModelService, public dialog: MatDialog,
              private matrixBasicDataService: MatrixBasicDataService) {}

  /**
   * Get reference to the recommendations and user
   */
  ngOnInit(): void {

    this.userContact = this.dataModelService.getUser().contact;
    const groups = this.dataModelService.getGroups();
    for (const group of groups){
      for (const recommendation of group.recommendations){
        this.recommendations.push(recommendation);
      }

      this.usedCurrencies.add(group.currency);
    }
  }

  /**
   * Calculate the total balance for the user for the selected Currency
   * @param currency the currency for which the balances should be calculated
   */
  public getTotalBalance(currency: Currency): number{
    const groups = this.dataModelService.getGroups();
    let balance = 0;
    for (const group of groups){
      if (group.currency === currency){
        // if (Utils.log) console.log(group.groupmembers);
        for (const member of group.groupmembers){
          // if (Utils.log) console.log('mem: ' + member.contact.contactId + ' ' + this.userContact.contactId);
          // if (Utils.log) console.log(member.balance);
          if (member.contact.contactId === this.userContact.contactId){
            balance += member.balance;
            break;
          }
        }
      }
    }

    return balance;
  }

  /**
   * Confirm the payback
   * @param recommendationIndex the Index of the recommendation that should be confirmed
   */
  confirmPayback(recommendationIndex: number): void {

    const currentRec = this.recommendations[recommendationIndex];
    console.log(currentRec);
    const dialogRef = this.dialog.open(ConfirmPaybackModalComponent, {
      width: '350px',
      data: {recommendation: currentRec, confirm: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogData = result;
      if (this.dialogData !== undefined){

        this.loadingConfirmPayback = true;
        // TODO Missing recommendationId
        promiseTimeout(TIMEOUT, this.matrixBasicDataService.confirmPayback(this.dialogData.recommendation.group.groupId, 0))
          .then((data) => {
            console.log(data);
            if (!data.wasSuccessful()){
              openErrorModal('error confirm payback 1: ' + data.getMessage(), this.dialog);
            }
            this.loadingConfirmPayback = false;
          }, (err) => {
            openErrorModal('error confirm payback 2: ' + err, this.dialog);
            this.loadingConfirmPayback = false;
          });
      }
    });
  }

}
