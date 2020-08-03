// as soon available import Recommendation from DataModel
// import {Recommendation} from './DataModel/Recommendation';
export class SolutionInstance {
  // private recommendations: Recommendation;
  private latestTransaction: string;

  constructor(/*recommendations: Recommendation,*/ latestTransaction: string) {
    // this.recommendations = recommendations;
    this.latestTransaction = latestTransaction;
  }

  /*getRecommendations(): Recommendation {
    return this.recommendations;
  }*/

  getLatestTransaction(): string {
    return this.latestTransaction;
  }
}
