import * as Koa from 'koa';
import Config from '../config'
import Msg from '../constants/msg'
import MsgCode from '../constants/msg-code'

export default function auth(options?: { getUser: boolean }) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const f = descriptor.value;
        descriptor.value = async (ctx: Koa.Context, next) => {
            const ctx_r = await Auth.beforeAuth(ctx, next, options);
            if (!ctx_r.body) {
                await f(ctx_r, next);
            }
        }

        return descriptor;
    }
}

class Auth {

    public static async beforeAuth(ctx: Koa.Context, next, options) {
        const { db, redis, msg, imsg } = ctx.service;
        const datr_user: string = await redis.get(Config.cache_key.user_token + msg.token);

        if (!datr_user || datr_user.length <= 0) {
            ctx.body = Msg.create(MsgCode.INVALID_TOKEN);
            return ctx;
        }

        imsg.uid = datr_user;

        if (options) {
            if (options.getUser) {
                const condition = { _id: imsg.uid };
                const dat_users = await db.user.find(condition);

                if (!dat_users || dat_users.length <= 0) {
                    ctx.body = Msg.create(MsgCode.INVALID_TOKEN);
                    return ctx;
                } else {
                    ctx.service.imsg.user = dat_users[0];
                }
            }
        }

        return ctx;
    }

}