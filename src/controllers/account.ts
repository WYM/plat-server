import * as Koa from 'koa';
import MsgCode from '../constants/msg-code'
import Msg from '../constants/msg'
import Config from '../config'
import Encrypt from '../utils/encrypt'
import Validate from '../utils/validate'
import Trace from '../utils/trace'

export default class Account {

    public static async onLogin(ctx: Koa.Context, next) {
        const { db, redis, msg } = ctx.service;

        const check = Account.checkLoginBase(msg);
        if (check !== MsgCode.OK) {
            ctx.body = Msg.create(check);
            return next;
        }

        const condition = msg.email ? { email: msg.email } : { username: msg.username };
        const dat_users = await db.user.find(condition);

        if (!dat_users || dat_users.length <= 0) {
            ctx.body = Msg.create(msg.email ? MsgCode.EMAIL_NOT_FOUND : MsgCode.USERNAME_NOT_FOUND);
            return next;
        }

        const dat_user = dat_users[0];
        const en_pass = Encrypt.encryptPassword(msg.password, dat_user.salt);
        if (en_pass != dat_user.password) {
            ctx.body = Msg.create(MsgCode.PASSWORD_INCORRECT);
            return next;
        }

        const token = Encrypt.generateToken(dat_user.id);
        await redis.set(Config.cache_key.user_token + token, dat_user.id);

        Trace.info(`User login [${dat_user.username}(${dat_user.email})], id: ${dat_user.id}, token: ${token}.`);

        const send = Msg.create();
        send.token = token;
        ctx.body = send;
    }

    public static async onCreate(ctx: Koa.Context, next) {
        const { db, msg } = ctx.service;

        const check = Account.checkLoginBase(msg);
        if (check !== MsgCode.OK) {
            ctx.body = Msg.create(check);
            return next;
        }

        const salt = Encrypt.generateSalt(Config.encrypt.salt_length);
        const entity = new db.user({
            email: msg.email,
            username: msg.username,
            nickname: msg.username,
            password: Encrypt.encryptPassword(msg.password, salt),
            salt: salt,
            avatar: Config.user.default_avatar
        });

        if (msg.email) {
            const cdt_email = { email: entity.email };
            const res_email = await db.user.find(cdt_email);
            if (res_email && res_email.length > 0) {
                ctx.body = Msg.create(MsgCode.EMAIL_OCCUPIED);
                return next;
            }
        }

        if (msg.username) {
            const cdt_username = { username: entity.username };
            const res_username = await db.user.find(cdt_username);
            if (res_username && res_username.length > 0) {
                ctx.body = Msg.create(MsgCode.USERNAME_OCCUPIED);
                return next;
            }
        }

        const save_result = await entity.save();
        if (!save_result) {
            ctx.body = Msg.create(MsgCode.DB_FAILED);
            return next;
        }

        Trace.info(`User created [${entity.username}(${entity.email})], id: ${entity.id}.`);

        const send = Msg.create();
        ctx.body = send;
    }

    private static checkLoginBase(msg: Msg): string {

        if (!msg) {
            return MsgCode.HTTP_INVALID_PARAM;
        }

        if (!(msg.email || msg.username)) {
            if (!msg.email) {
                return MsgCode.EMAIL_REQUIRED;
            } else {
                return MsgCode.USERNAME_REQUIRED;
            }
        }

        if (!msg.password) {
            return MsgCode.PASSWORD_REQUIRED;
        }

        if (!msg.email) {
            if (!Validate.username(msg.username)) {
                return MsgCode.USERNAME_INVALID;
            }
        } else {
            if (!Validate.email(msg.email)) {
                return MsgCode.EMAIL_INVALID;
            }
        }

        if (!Validate.password(msg.password)) {
            return MsgCode.PASSWORD_INVALID;
        }

        return MsgCode.OK;
    }

}