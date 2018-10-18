'use strict'

module.exports = {
    /**
     * 定义错误处理->此处抛出异常会由middleware=>error_handler处理
     * context上的错误一般是应用程序接口级别的错误,故一级错误码为success
     * @param msg
     * @param errCode
     * @param retCode
     */
    error({msg, errCode, retCode, data}) {

        try {

            const {retCodeEnum, errCodeEnum, type} = this.app
            const message = type.error(arguments[0])
                ? arguments[0].message || arguments[0].toString()
                : type.string(arguments[0]) ? arguments[0] : msg || '接口内部异常'

            throw Object.assign(new Error(message), {
                retCode: retCode ? retCode : retCodeEnum.success,
                errCode: errCode ? errCode : errCodeEnum.apiError,
                data: !type.undefined(data) ? data : type.error(arguments[0]) ? arguments[0].data : undefined
            })
        } catch (e) {
            console.log('异常处理出现异常:', e, ...arguments)
            throw e
        }
    },

}