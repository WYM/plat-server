import * as Mongoose from 'mongoose';

export interface IUser extends Mongoose.Document {
    email: string;
    username: string;
    nickname: string;
    password: string;
    salt: string;
    avatar: string;
    apps: Array<string>;
};

export const UserSchema = new Mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    apps: {
        type: Array,
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

export const UserModel = Mongoose.model<IUser>('User', UserSchema);