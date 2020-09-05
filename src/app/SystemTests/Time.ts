export class Time{

    public time: number;
    public id: string;

    constructor(time: number, id: string) {
        this.time = time;
        this.id = id;
    }
}

export function getTimeByID(id: string) {
    for (const time of times){
        if (time.id == id){
            return time.time;
        }
    }
    return 0;
}

export const times: Time[] = [];

