'use strict'

module.exports = class AccountSignatureVerifyFailedEventHandler {

    constructor(app) {
        this.app = app
    }

    /**
     * 事件处理函数
     */
    async handler() {
        this.accountSignatureVerifyFailedEventHandler(...arguments)
    }

    /**
     * 账户签名校验异常事件
     * @param accountInfo
     */
    accountSignatureVerifyFailedEventHandler(accountInfo) {
        this.app.logger.error("feather-transfer-handler-error", '账户数字签名校验失败,数据异常', accountInfo)
        console.log("feather-transfer-handler-error", '账户数字签名校验失败,数据异常', JSON.stringify(accountInfo))
    }
}