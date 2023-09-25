export interface Training {
    id: string;
    uid: string;
    name: string;
    exercises: Exercise[];
    createdAt: number;
}

export interface Exercise {
    name: string;
    weight: string;
    rounds: number;
    reps: number;
}