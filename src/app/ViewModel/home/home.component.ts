import {Component, OnInit} from '@angular/core';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency, currencyMap} from '../../DataModel/Utils/Currency';
import {Contact} from '../../DataModel/Group/Contact';

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

  constructor(private dataModelService: DataModelService) {}

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
        console.log(group.groupmembers);
        for (const member of group.groupmembers){
          console.log('mem: ' + member.contact.contactId + ' ' + this.userContact.contactId);
          console.log(member.balance);
          if (member.contact.contactId === this.userContact.contactId){
            balance += member.balance;
            break;
          }
        }
      }
    }

    return balance;
  }

  public confirmPayback(payerId: string, recipientId: string, amount: number): void{

  }

}
