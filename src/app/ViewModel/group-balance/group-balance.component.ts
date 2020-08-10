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

  currencyMap = currencyMap;
  dialogData: ConfirmPaybackDialogData;

  recommendations: Recommendation[] = [];
  data = [];

  getCustomColor = (name) => {
    for (const entry of this.data){
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

  ngOnChanges(): void {
    // Initializes the graph with the balances of the members
    this.data = [];
    const groupMembers = this.group.groupmembers;
    for (const groupMember of groupMembers){
      this.data.push({name: groupMember.contact.name, value: groupMember.balance});
    }

    this.recommendations = this.group.recommendations;
  }

  confirmPayback(recommendationIndex: number): void {

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
