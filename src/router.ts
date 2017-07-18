import * as Router from 'koa-router'
import url from './constants/url'
import account from './controllers/account';
import cdkey from './controllers/cdkey'

const router = new Router();

router.post(url.ACCOUNT_CREATE, account.onCreate);
router.post(url.ACCOUNT_LOGIN, account.onLogin);
router.post(url.CDKEY_INFO, cdkey.onInfo);
router.post(url.CDKEY_USE, cdkey.onUse);

export default router