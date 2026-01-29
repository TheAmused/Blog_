export interface IData {
    title: string;
    text: string;
    image: string;
    userId: string;
    _id?: string;
    likes?: string[];
    views?: number;
    comments?: { text: string; date: Date }[];
}

export type Query<T> = {
    [key: string]: T;
};