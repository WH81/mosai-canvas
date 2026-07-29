import { Document } from 'mongoose';

export interface IAbout extends Document {
    id?: string;
    title: string;
    body: string;
}