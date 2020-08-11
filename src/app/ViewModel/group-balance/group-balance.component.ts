import {Component, Input, OnChanges} from '@angular/core';
import {Group} from '../../DataModel/Group/Group';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {currencyMap} from '../../DataModel/Utils/Currency';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmPaybackDialogData, ConfirmPaybackModalComponent} from '../confirm-payback-modal/confirm-payback-modal.component';

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

  public recommendations: Recommendation[] = [];
  public balanceData = [];

  /**
   * Calculate the color for each bar in the balance chart and return red or green depending on the balance
   * @param name the name of the data entry
   */
  public getCustomColor = (name) => {
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

  constructor(public dialog: MatDialog) {
  }

  /**
   * Update the balances and recommendations every time something in the viewModel changes
   * this is necessary to detect the changes of the group form the group-selection-component
   */
  ngOnChanges(): void {
    // Initializes the graph with the balances of the members
    this.balanceData = [];
    const groupMembers = this.group.groupmembers;
    for (const groupMember of groupMembers){
      this.balanceData.push({name: groupMember.contact.name, value: groupMember.balance});
    }

    this.recommendations = this.group.recommendations;
  }

  /**
   * Confirm the payback
   * @param recommendationIndex the index of the recommendation to confirm
   */
  public confirmPayback(recommendationIndex: number): void {

      const currentRec = this.recommendations[recommendationIndex];
      const dialogRef = this.dialog.open(ConfirmPaybackModalComponent, {
        width: '350px',
        data: {group: this.group.name, confirm: false, recipient: currentRec.recipient.contact, amount: currentRec.recipient.amount,
          currency: this.group.currency}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.dialogData = result;
        if (this.dialogData !== undefined){
          // TODO Send Data to matrix here
          console.log(this.dialogData);
        }
      });
  }

}
