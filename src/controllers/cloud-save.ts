import * as Koa from 'koa';
import MsgCode from '../constants/msg-code'
import Msg from '../constants/msg'
import Config from '../config'
import Trace from '../utils/trace'
import Auth from '../decorators/auth'
import Encrypt from '../utils/encrypt'
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
        msg.appid = ctx.query.appid;

        let dat_saved: ISavedata = await db.savedata.where('uid').equals(imsg.user.id);
        if (!dat_saved) {
            dat_saved = new db.savedata({
                uid: imsg.user.id,
                data: []
            });
        }

        let save_app_idx: number = -1;
        const saves = dat_saved.data;
        for (let i = 0; i < saves.length; i++) {
            if (saves[i].appid == msg.appid) {
                save_app_idx = i;
                break;
            }
        }

        let save_app: ISavedataItem;
        if (save_app_idx < 0) {
            save_app_idx = saves.length;
            save_app = {
                appid: msg.appid,
                filename: '',
                update: 0
            }
            saves.push(save_app);
        } else {
            save_app = saves[save_app_idx]
        }

        // TODO handle uploaded file
        console.log(ctx.body.file);
        save_app.filename = Encrypt.generateSalt(12);
        save_app.update = new Date().getTime();

        const result = await dat_saved.save();
        if (!result) {
            ctx.body = Msg.create(MsgCode.DB_FAILED);
            return ctx;
        }

        const send = Msg.create();
        send.savedata = save_app;
        ctx.body = { msg: send };
        return ctx;
    }

}