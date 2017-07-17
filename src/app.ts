import * as Koa from 'koa'
import * as cors from 'kcors';
import * as compress from 'koa-compress'
import * as json from 'koa-json';
import * as bodyParser from 'koa-bodyparser'
import Database from './middleware/db'
import Redis from './middleware/redis'
import Config from './config'
import Trace from './utils/trace'
import router from './router';
import msgParser from './middleware/msg-parser'
import innerMsg from './middleware/inner-msg'

const app = new Koa();

// time elapsed
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    Trace.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// init ctx.service
const db = Database(Config.mongoose);
app.use(async (ctx, next) => {
    ctx.service = {
        db: db
    };
    await next();
});

// ioredis
app.use(Redis(Config.redis));

// msg-parser
app.use(bodyParser());
app.use(msgParser());
app.use(innerMsg());

// koa-json
app.use(json());

// koa-router
app.use(router.routes()).use(router.allowedMethods());

// kcors, cross-origin
app.use(cors());

// koa-compress, gzip
app.use(compress({
  filter: function (ctype) {
    return /text/i.test(ctype)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));

// error-handling
app.on('error', (error: any, ctx: Koa.Context) => {
    Trace.error(error);
    Trace.error(ctx.toJSON());
});

app.listen(Config.port);