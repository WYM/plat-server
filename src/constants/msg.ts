import MsgCode from './msg-code'
import { IUser } from '../models/user'
import { IApp } from '../models/app'
import { ISavedataItem } from '../models/savedata'

export default class Msg {
    public status: string;
    public token: string;

    public uid: string;
    public email: string;
    public username: string;
    public password: string;

    public cdkey: string;

    public user: IUser;

    public appid: string;
    public app: IApp;
    public apps: IApp[];

    public savedata: ISavedataItem;

    public static create(status: string = MsgCode.OK): Msg {
        const msg = new Msg();
        msg.status = status;

        return msg;
    }
}