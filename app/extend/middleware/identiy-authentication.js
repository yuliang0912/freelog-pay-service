'use strict'

/**
 * Created by yuliang on 2017/7/21.
 * 身份认证中间件
 * 中间件如果有身份信息,则附加到ctx.request中.没有的话则不处理
 * 由应用层自己判断是否需要做身份校验
 */
module.exports = () => async (ctx, next) => {

    //let {retCodeEnum, errCodeEnum} = ctx.app

    //此处的header信息是由gateway服务器追加.由gateway服务来做签名校验,上层服务只需要解析身份信息即可
    let authTokenStr = ctx.headers['auth-token']

    if (!authTokenStr) {
        return await next()
    }

    let authToken = JSON.parse(new Buffer(authTokenStr, 'base64').toString())

    let authInfo = {}
    switch (authToken.type) {
        case 'jwt':
            authInfo = {
                userId: authToken.info.userId,
                identityInfo: {
                    userInfo: authToken.info,
                    tokenType: authToken.type
                }
            }
            break
        case 'token-client':
            authInfo = {
                userId: authToken.info.userId,
                identityInfo: authToken.info
            }
        default:
            break;
    }

    console.log(authInfo)

    Object.assign(ctx.request, authInfo)

    await next()
}