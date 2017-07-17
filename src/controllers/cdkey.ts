import * as Koa from 'koa';
import MsgCode from '../constants/msg-code'
import Msg from '../constants/msg'
import Config from '../config'
import Trace from '../utils/trace'
import Auth from '../decorators/auth'

export default class Cdkey {

    @Auth('user')
    public static async onUse(ctx: Koa.Context, next) {
        console.log(ctx.service);
        const { db, msg, imsg } = ctx.service;

        console.log(msg);

        const send = Msg.create();
        send.uid = imsg.uid;

        ctx.body = { msg: send };
    }


}