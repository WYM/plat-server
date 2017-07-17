import MsgCode from './msg-code'
import { IUser } from '../models/user'

export default class Msg {
    public status: string;
    public token: string;

    public uid: string;
    public email: string;
    public username: string;
    public password: string;

    public user: IUser;

    public static create(status: string = MsgCode.OK): Msg {
        const msg = new Msg();
        msg.status = status;

        return msg;
    }
}