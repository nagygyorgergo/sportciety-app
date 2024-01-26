export interface PersonalBest {
    id: string;
    uid: string; //crator user's uid
    exerciseName: string; //for example: bench press or 400m running
    type: string; //strength or endurance
    records: PersonalBestRecord[];
}

export interface PersonalBestRecord {
    id: string | null,
    createdAt: number;
    value: number
}

/* 
export interface PersonalBestEnduranceRecord {
    createdAt: number;
    time: number
}
 */