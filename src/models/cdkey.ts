import * as Mongoose from 'mongoose';

export interface ICdkey extends Mongoose.Document {
    tpl: string;
    key: string;
    userId: string;
};

export const CdkeySchema = new Mongoose.Schema({
    tpl: {
        type: String,
        unique: true,
        required: true
    },
    key: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: String,
        unique: false,
        required: false
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

export const CdkeyModel = Mongoose.model<ICdkey>('Cdkey', CdkeySchema);