import * as Koa from 'koa';
import MsgCode from '../constants/msg-code'
import Msg from '../constants/msg'
import Config from '../config'
import Trace from '../utils/trace'
import Auth from '../decorators/auth'

export default class Cdkey {

    @Auth()
    public static async onInfo(ctx: Koa.Context, next) {
        const { db, msg, imsg } = ctx.service;

        const dat_cdkey = await db.cdkey.findOne({ key: msg.cdkey });

        if (!dat_cdkey) {
            ctx.body = Msg.create(MsgCode.CDKEY_INVALID);
            return ctx;
        }

        if (dat_cdkey.userId && dat_cdkey.userId.length > 0) {
            ctx.body = Msg.create(MsgCode.CDKEY_USED);
            return ctx;
        }

        const dat_tpl = await db.cdkeyTpl.findOne({ _id: dat_cdkey.tpl });
        if (!dat_tpl) {
            Trace.error(`Incorrect CDKey [${dat_cdkey.key}], no tpl.`);
            ctx.body = Msg.create(MsgCode.CDKEY_INVALID);
            return ctx;
        }

        const dat_app = await db.app.findOne({ _id: dat_tpl.appid });
        if (!dat_app) {
            Trace.error(`Incorrect CdKeyTpl [${dat_tpl.id}], no app.`);
            ctx.body = Msg.create(MsgCode.CDKEY_INVALID);
            return ctx;
        }

        const send = Msg.create();
        send.app = dat_app;
        ctx.body = send;
        return ctx;
    }

    @Auth({ getUser: true })
    public static async onUse(ctx: Koa.Context, next) {
        const { db, msg, imsg } = ctx.service;

        const dat_cdkey = await db.cdkey.findOne({ key: msg.cdkey });

        if (!dat_cdkey) {
            ctx.body = Msg.create(MsgCode.CDKEY_INVALID);
            return ctx;
        }

        if (dat_cdkey.userId && dat_cdkey.userId.length > 0) {
            ctx.body = Msg.create(MsgCode.CDKEY_USED);
            return ctx;
        }

        const dat_tpl = await db.cdkeyTpl.findOne({ _id: dat_cdkey.tpl });
        if (!dat_tpl) {
            Trace.error(`Incorrect CDKey [${dat_cdkey.key}], no tpl.`);
            ctx.body = Msg.create(MsgCode.CDKEY_INVALID);
            return ctx;
        }

        const dat_app = await db.app.findOne({ _id: dat_tpl.appid });
        if (!dat_app) {
            Trace.error(`Incorrect CdKeyTpl [${dat_tpl.id}], no app.`);
            ctx.body = Msg.create(MsgCode.CDKEY_INVALID);
            return ctx;
        }

        const apps = imsg.user.apps;
        for (let i = 0; i < apps.length; i++) {
            if (apps[i] == dat_app.id) {
                ctx.body = Msg.create(MsgCode.APP_ALREADY_HAVE);
                return ctx;
            }
        }

        imsg.user.apps.push(dat_app.id);
        const result = await imsg.user.save();
        if (!result) {
            ctx.body = Msg.create(MsgCode.DB_FAILED);
            return ctx;
        }

        dat_cdkey.userId = imsg.user.id;
        const cdkey_result = await dat_cdkey.save();
        if (!cdkey_result) {
            Trace.error(JSON.stringify({ uid: imsg.user.id, cdkey: dat_cdkey.id, msg: 'user got the app, otherwise the `userId` of cdkey not updated.' }));
        }

        const send = Msg.create();
        send.apps = await db.app.where('_id').in(imsg.user.apps).find();

        ctx.body = { msg: send };
    }


}