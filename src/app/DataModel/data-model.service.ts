import {Injectable} from '@angular/core';
import {User} from './User/User';
import {Status} from './Status/Status';
import {Group} from './Group/Group';
import {Transaction} from './Group/Transaction';
import {BalanceCalculatorService} from '../CalculateEmergentData/balance-calculator.service';
import {GreedyOptimisationService} from '../CalculateEmergentData/greedy-optimisation.service';
import {MatrixEmergentDataService} from '../ServerCommunication/CommunicationInterface/matrix-emergent-data.service';
import {Contact} from './Group/Contact';
import {Currency} from './Utils/Currency';
import {Language} from './Utils/Language';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that provides an entry point for the DataModel.
 */
export class DataModelService {
  private status: Status;

  /**
   * Cunstructor for DataModelService
   * @param balanceCalculator  An Instance of BalanceCalculatorService that is used in DataModelService
   * @param greedyOptimisation  An Instance of BalanceCalculatorService that is used in DataModelService
   * @param matrixEmergentData  An Instance of BalanceCalculatorService that is used in DataModelService
   */
  constructor(private balanceCalculator: BalanceCalculatorService,
              private greedyOptimisation: GreedyOptimisationService,
              private matrixEmergentData: MatrixEmergentDataService) {

  }

  public getUser(): User{ // TODO: Delete Later
    return this.user;
  }

  /**
   * Initializes the User object when the application is loaded. Also initializes an empty status object.
   * @param userContactId  ID of the user contact.
   * @param userName  Name of the user contact.
   * @param currency  Preferred currency of the user. When the user crates a group, this currency will be preselected,
   * though any currency can be manually selected as well.
   * @param language  Language of the user. This parameter sets the language displayed in the view.
   */
  public initializeUserThisSession(userContactId: string, userName: string, currency: Currency, language: Language): User{
    const contact = new Contact(userContactId, userName);
    const user = new User(contact, currency, language);
    this.status = new Status();
    return user;
  }

  /**
   * Initializes the user object with as few arguments as possible and sets default values for currency = EUR and language = GERMAN.
   * Also initializes an empty status object.
   * @param userContactId  Id of the user contact.
   * @param userName  Name of the user contact.
   * @returns  The user object.
   */
  public initializeUserFirstTime(userContactId: string, userName: string): User{
    const contact = new Contact(userContactId, userName);
    const user = new User(contact, Currency.EUR, Language.GERMAN);
    this.status = new Status();
    return user;
  }

  /**
   * Returns user object, which is a singleton
   */
  public get user(): User {
    return User.singleUser;
  }

  /**
   * Returns the transaction array of the group specified by Id.
   * @param groupId  ID of the group of which the transaction array should be returned
   */
  public getTransactions(groupId: string): Transaction[] {
    return this.getGroup(groupId).transactions;
  }

  /**
   * returns a specific transaction specified by transactionId of the group specified by groupId.
   * @param groupId  ID of the group of which the transaction should be returned.
   * @param transactionId  ID of the transaction that should be returned.
   */
  public getTransaction(groupId: string, transactionId: string): Transaction {
    return this.getGroup(groupId).getTransaction(transactionId);
  }

  /**
   * Returns an array with all of the user object's groups.
   */
  public getGroups(): Group[] {
    return this.user.groups;
  }

  /**
   * Returns a specific group specified by ID.
   * @param groupId  ID of the group that should be returned.
   */
  public getGroup(groupId: string): Group { // TODO: implement it. DONE
    return this.user.getGroup(groupId);
  }

  /**
   * Returns the status object containing information about the state of the application.
   */
  public getStatus(): Status {
    return this.status;
  }

  /**
   * Calculates the balances the user saves for all groupmembers of one group resulting from a number of given new transactions and the
   * previous balances.
   * Sends the resulting balances to ServerCommunication/MatrixEmergentDataService for saving.
   * Calculates recommended Paybacks for the group.
   * Sends the resulting recommendations to ServerCommunication/MatrixEmergentDataService for saving.
   * @param groupId  ID of the group for which the balances should be calculated.
   * @param transactions  Array of new transactions that should be regarded in the calculation.
   * @param lastTransactionId  ID of the last transaction that is regarded by the calculation.
   */
  public calculateBalances(groupId: string, transactions: Transaction[], lastTransactionId: string): void {
    const group = this.getGroup(groupId);

    const problem = this.balanceCalculator.calculateBalances(group.groupmembers, transactions);
    const response = this.matrixEmergentData.setBalances(groupId, problem.getBalances(), problem.getUsers(), lastTransactionId);
    this.status.newResponse(response);
    if (!response.wasSuccessful()) {
      // Do some Error stuff
    }
    else {
      const solution = this.greedyOptimisation.calculateOptimisation(problem);
      const response2 = this.matrixEmergentData.setRecommendations(groupId, solution.getAmounts(), solution.getPayerIds(),
        solution.getRecipientIds(), lastTransactionId);
      this.status.newResponse(response2);
      if (!response2.wasSuccessful()) {
        // Do some Error stuff
      }
    }
  }
}
