import * as Koa from 'koa';
import MsgCode from '../constants/msg-code'
import Msg from '../constants/msg'
import Config from '../config'
import Trace from '../utils/trace'
import Auth from '../decorators/auth'
import { ISavedata, ISavedataItem } from '../models/savedata'

export default class CloudSave {

    @Auth({ getUser: true })
    public static async onInfo(ctx: Koa.Context, next) {
        const { db, msg, imsg } = ctx.service;

        let dat_saved: ISavedata = await db.savedata.where('uid').equals(imsg.user.id);
        if (!dat_saved) {
            dat_saved = await new db.savedata({
                uid: imsg.user.id,
                data: []
            }).save();
        }

        let save_app: ISavedataItem;
        const saves = dat_saved.data;
        for (let i = 0; i < saves.length; i++) {
            if (saves[i].appid == msg.appid) {
                save_app = saves[i];
                break;
            }
        }

        if (!save_app || !save_app.filename || save_app.filename == '') {
            ctx.body = Msg.create(MsgCode.NO_SAVE);
            return ctx;
        }

        const send = Msg.create();
        send.savedata = save_app;
        ctx.body = send;
        return ctx;
    }

    @Auth({ getUser: true })
    public static async onUpload(ctx: Koa.Context, next) {
        const { db, msg, imsg } = ctx.service;
        const send = Msg.create();

        ctx.body = { msg: send };
    }


}