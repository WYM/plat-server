import * as Koa from 'koa';
import Msg from '../constants/msg'

export default function () {
    return async (ctx: Koa.Context, next) => {
        ctx.service.imsg = Msg.create();
        await next();
    }
}