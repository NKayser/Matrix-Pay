export class Time{

    constructor(time: number, id: string) {
        this.time = time;
        this.id = id;
    }

  public static transactionTimes: Time[] = [];
  public static groupCreationTime = 0;

    public time: number;
    public id: string;

  public static getTransactionTimeByID(id: string): number {
    for (const time of Time.transactionTimes){
      if (time.id === id){
        return time.time;
      }
    }
    return 0;
  }

}

