export interface Post {
    id: string;
    uid: string; //crator user's uid
    text: string;
    createdAt: number;
    likeCount: number;
    likerUids: string[];
    likerNames: string[];
}
