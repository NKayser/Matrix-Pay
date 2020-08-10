import {Component, OnInit} from '@angular/core';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency, currencyMap} from '../../DataModel/Utils/Currency';
import {Contact} from '../../DataModel/Group/Contact';
import {ConfirmPaybackDialogData, ConfirmPaybackModalComponent} from '../confirm-payback-modal/confirm-payback-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Utils} from "../../ServerCommunication/Response/Utils";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usedCurrencies: Set<Currency> = new Set();
  userContact: Contact;

  recommendations: Recommendation[] = [];
  currencyMap = currencyMap;
  dialogData: ConfirmPaybackDialogData;

  constructor(private dataModelService: DataModelService, public dialog: MatDialog) {}

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

  // Calculate the total Balances of the User
  public getTotalBalance(currency: Currency): number{
    const groups = this.dataModelService.getGroups();
    let balance = 0;
    for (const group of groups){
      if (group.currency === currency){
        if (Utils.log) console.log(group.groupmembers);
        for (const member of group.groupmembers){
          if (Utils.log) console.log('mem: ' + member.contact.contactId + ' ' + this.userContact.contactId);
          if (Utils.log) console.log(member.balance);
          if (member.contact.contactId === this.userContact.contactId){
            balance += member.balance;
            break;
          }
        }
      }
    }

    return balance;
  }

  confirmPayback(recommendationIndex: number): void {

    const currentRec = this.recommendations[recommendationIndex];
    const dialogRef = this.dialog.open(ConfirmPaybackModalComponent, {
      width: '350px',
      data: {group: currentRec.group.name, confirm: false, recipient: currentRec.recipient.contact, amount: currentRec.recipient.amount,
        currency: currentRec.group.currency}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogData = result;
      if (this.dialogData !== undefined){
        // TODO Send Data to matrix here
        if (Utils.log) console.log(this.dialogData);
      }
    });
  }

}
