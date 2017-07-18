import * as Koa from 'koa';
import Msg from '../constants/msg'
import Trace from '../utils/trace'

export default function () {
    return async (ctx: Koa.Context, next) => {
        const dat = ctx.request.body['dat'];
        if (dat) {
            try {
                ctx.service.msg = JSON.parse(dat);
            } catch (e) {
                Trace.error(e);
                ctx.service.msg = Msg.create();
            }
        } else {
            ctx.service.msg = Msg.create();
        }
        await next();
    }
}