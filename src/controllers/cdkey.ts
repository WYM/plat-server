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

        

        const send = Msg.create();
        send.uid = imsg.uid;

        ctx.body = { msg: send };
    }


}