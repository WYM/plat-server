# Plat Server

## 请求结构
#### 上传
    method  POST
    query   
        dat: Msg
#### 下发
    body
        Msg

## Account

### /account/create
用户注册
#### 验证：无
#### 上传
    email           string          邮箱 (与用户名任填其一)
    username        string          用户名 (与用户名任填其一)
    password        string          密码

#### 下发
    status          string          状态码
        OK                              正常
        EMAIL_REQUIRED                  email 不能为空
        USERNAME_REQUIRED               username 不能为空
        PASSWORD_REQUIRED               password 不能为空
        EMAIL_INVALID                   email 格式不合法
        USERNAME_INVALID                username 格式不合法
        PASSWORD_INVALID                password 格式不合法
        EMAIL_OCCUPIED                  email 已经被使用
        USERNAME_OCCUPIED               username 已经被使用

### /account/login
用户登入
#### 验证：无
#### 上传
    email           string          邮箱 (与用户名任填其一)
    username        string          用户名 (与用户名任填其一)
    password        string          密码

#### 下发
    status          string          状态码
        OK                              正常
        EMAIL_REQUIRED                  email 不能为空
        USERNAME_REQUIRED               username 不能为空
        PASSWORD_REQUIRED               password 不能为空
        EMAIL_INVALID                   email 格式不合法
        USERNAME_INVALID                username 格式不合法
        PASSWORD_INVALID                password 格式不合法
        EMAIL_NOT_FOUND                 email 未找到
        USERNAME_NOT_FOUND              username 未找到
        PASSWORD_INCORRECT              密码不正确
    token           string          登录凭证
    apps            IApp[]          拥有的app列表
    
----

## CDKey
### /cdkey/info
查看一条激活码信息
#### 验证：@Auth()
#### 上传
    key             string          要查询的激活码 Key

#### 下发
    status          string          状态码
        OK                              正常
        CDKEY_INVALID                   无效激活码（为空、不存在或模板和App信息有误）
        CDKEY_USED                      激活码已被使用
    app             IApp            激活码使用后可获得App的信息

### /cdkey/use
使用一条激活码
#### 验证：@Auth()
#### 上传
    key             string          要查询的激活码 Key

#### 下发
    status          string          状态码
        OK                              正常
        CDKEY_INVALID                   无效激活码
        CDKEY_USED                      激活码已被使用
        DB_FAILED                       数据库存储异常
    apps            IApp[]          使用激活码后 玩家拥有的所有App信息

----
## Migrate

### /migrate
初始化测试用数据
#### 验证：无
#### 上传
    无

#### 下发
    无

----

## 验证
### @Auth()
该验证根据客户端提供的token，检查其登录状态，并依此找出对应的用户信息。
所有使用该验证的接口，在执行自身逻辑前都会先检查验证条件，不满足时将直接返回状态码。
#### 上传
    token           string          登录凭证 在登录时取得
#### 下发
    status          string          状态码
        OK                              正常
        INVALID_TOKEN                   无效token
        DB_FAILED                       数据库错误

----

## 实体
### Msg
基本消息体，通常所有其他实体都包裹于msg内。

该实体在客户端上发时通常以HTTP参数的形式发送，名为dat。在服务器下发时，通常直接作为返回体。

    public status: string;
    public token: string;

    public uid: string;
    public email: string;
    public username: string;
    public password: string;
    public cdkey: string;

    public user: IUser;
    public app: IApp;
    public apps: IApp[];

### IUser
用户信息实体，与数据库结构一致。

password 和 salt 通常不会被下发。

    email: string;
    username: string;
    nickname: string;
    password: string;
    salt: string;
    avatar: string;
    apps: Array<string>;

### IApp
App信息实体，与数据库结构一致。

    name: string; 
    identifier: string;