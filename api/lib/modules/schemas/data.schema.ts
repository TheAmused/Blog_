import { Schema, model } from 'mongoose';

export const DataSchema: Schema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true },
    likes: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    comments: { 
        type: [{ 
            userId: { type: String, required: true },
            text: String, 
            date: { type: Date, default: Date.now } 
        }], 
        default: [] 
    }
});

export default model('post-kos', DataSchema, 'posts');