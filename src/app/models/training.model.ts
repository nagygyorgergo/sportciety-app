export interface Training {
    id: string;
    uid: string;
    name: string;
    exercises: Exercise[];
    createdAt: number;
    isShared: boolean;
    sharingDate: number;
}

export interface Exercise {
    name: string;
    weight: string;
    rounds: number;
    reps: number;
}