import * as Mongoose from 'mongoose';

export interface ICdkeyTpl extends Mongoose.Document {
    appid: string;
};

export const CdkeyTplSchema = new Mongoose.Schema({
    appid: {
        type: String,
        unique: false,
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

export const CdkeyTplModel = Mongoose.model<ICdkeyTpl>('CdkeyTpl', CdkeyTplSchema);