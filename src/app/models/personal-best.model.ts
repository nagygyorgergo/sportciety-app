export interface PersonalBest {
    id: string;
    uid: string; //crator user's uid
    exerciseName: string; //for example: bench press or 400m running
    type: string; //strength or endurance
    record: PersonalBestStrenghtRecord[] | PersonalBestEnduranceRecord[];
}

export interface PersonalBestStrenghtRecord {
    createdAt: number;
    weight: number
}


export interface PersonalBestEnduranceRecord {
    createdAt: number;
    time: number
}
