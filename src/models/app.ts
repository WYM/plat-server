import * as Mongoose from 'mongoose';

export interface IApp extends Mongoose.Document {
    name: string,
    identifier: string
};

export const AppSchema = new Mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    identifier: {
        type: String,
        unique: true,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});

export const AppModel = Mongoose.model<IApp>('App', AppSchema);