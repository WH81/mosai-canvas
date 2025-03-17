import { Schema, model, Document } from 'mongoose';

export interface IAbout extends Document {
  title: string;
  body: string;
}

const AboutSchema: Schema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
});

const About = model<IAbout>('About', AboutSchema);
export default About;
