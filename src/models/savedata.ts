import * as Mongoose from 'mongoose';

export interface ISavedata extends Mongoose.Document {
    uid: string,
    data: ISavedataItem[]
};

export interface ISavedataItem {
    appid: string,
    filename: string,
    update: number
}

export const SavedataSchema = new Mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    data: {
        type: Array,
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

export const SavedataModel = Mongoose.model<ISavedata>('Savedata', SavedataSchema);