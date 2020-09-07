import {Component, Input, OnChanges} from '@angular/core';
import {Group} from '../../DataModel/Group/Group';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {currencyMap} from '../../DataModel/Utils/Currency';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmPaybackDialogData, ConfirmPaybackModalComponent} from '../confirm-payback-modal/confirm-payback-modal.component';
import {promiseTimeout, TIMEOUT} from '../promiseTimeout';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {DialogProviderService} from '../dialog-provider.service';
import {gridListResize} from '../gridListResizer';
import {DataModelService} from '../../DataModel/data-model.service';
import {Contact} from '../../DataModel/Group/Contact';

@Component({
  selector: 'app-group-balance',
  templateUrl: './group-balance.component.html',
  styleUrls: ['./group-balance.component.css']
})
export class GroupBalanceComponent implements OnChanges {

  // Input is used to pass the current selected group to the balance component
  @Input() group: Group;

  public currencyMap = currencyMap;
  private dialogData: ConfirmPaybackDialogData;

  public loadingConfirmPayback = false;

  public recommendations: Recommendation[] = [];
  public balanceData = [];
  public userContact: Contact;

  // used to resize the gridList
  public breakpoint: number;

  /**
   * Calculate the color for each bar in the balance chart and return red or green depending on the balance
   * @param name the name of the data entry
   */
  public getCustomColor = (name) => {
    // this could be speed up with a hashmap instead iterating over the data until the correct user is found
    for (const entry of this.balanceData){
      if (entry.name === name){
        if (entry.value >= 0){
          return 'green';
        } else{
          return 'red';
        }
      }
    }
  }

  constructor(public dialog: MatDialog, public matrixBasicDataService: MatrixBasicDataService,
              private dialogProviderService: DialogProviderService, private dataModelService: DataModelService) {
  }

  /**
   * Update the balances and recommendations every time something in the viewModel changes
   * this is necessary to detect the changes of the group form the group-selection-component
   */
  ngOnChanges(): void {

    this.userContact = this.dataModelService.getUser().contact;
    // Initializes the graph with the balances of the members
    this.updateBalances();
    this.dataModelService.getBalanceEmitter().subscribe(this.updateBalances());

    this.recommendations = this.group.recommendations;

    // initialize the number of the grid list columns for the recommendations
    this.breakpoint = gridListResize(window.innerWidth, 1920, 3);
  }

  private updateBalances(): void {
    this.balanceData = [];
    const groupMembers = this.group.groupmembers;
    for (const groupMember of groupMembers){
      if (groupMember.active){
        this.balanceData.push({name: groupMember.contact.name, value: groupMember.balance / 100});
      }
    }
  }

  /**
   * Calculate the number of columns for the grid list, when the screen size changes;
   * @param event when the screen changes size
   */
  onResize(event): void {
    // TODO Magic numbers in the function
    this.breakpoint = gridListResize(event.target.innerWidth, 1920, 3);
  }

  /**
   * Confirm the payback
   * @param recommendationIndex the index of the recommendation to confirm
   */
  public confirmPayback(recommendationIndex: number): void {

      const currentRec = this.recommendations[recommendationIndex];
      const dialogRef = this.dialog.open(ConfirmPaybackModalComponent, {
        width: '350px',
        data: {recommendation: currentRec}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.dialogData = result;
        if (this.dialogData !== undefined){
          this.loadingConfirmPayback = true;

          // TODO Missing recommendationId
          promiseTimeout(TIMEOUT, this.matrixBasicDataService.createTransaction(this.dialogData.recommendation.group.groupId,
            'Payback from ' + this.dialogData.recommendation.payer.contact.name + ' to ' +
            this.dialogData.recommendation.recipient.contact.name,
            this.dialogData.recommendation.payer.contact.contactId, [this.dialogData.recommendation.recipient.contact.contactId],
            [this.dialogData.recommendation.recipient.amount], true))
            .then((data) => {
              if (!data.wasSuccessful()){
                this.dialogProviderService.openErrorModal('error confirm payback 1: ' + data.getMessage(), this.dialog);
              }
              this.loadingConfirmPayback = false;
            }, (err) => {
              this.dialogProviderService.openErrorModal('error confirm payback 2: ' + err, this.dialog);
              this.loadingConfirmPayback = false;
            });


        }
      });
  }

}
