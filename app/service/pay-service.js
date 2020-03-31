'use strict'

const uuid = require('uuid')
const lodash = require('lodash')
const Service = require('egg').Service
const CurrencyTypeEnum = require('../enum/currency-type')
const PaymentService = require('../payment-service/index')
const {ApplicationError} = require('egg-freelog-base/error')
const {tradeType, tradeStatus, accountEvent} = require('../enum/index')
const accountAuthorization = require('../account-service/account-authorization/index')
const {accountInfoSecurity, paymentOrderSecurity} = require('../account-service/account-security/index')

module.exports = class PayService extends Service {

    constructor({app, request}) {
        super(...arguments)
        this.userId = request.userId
        this.accountProvider = app.dal.accountProvider
        this.paymentOrderProvider = app.dal.paymentOrderProvider
        this.accountPendTradeProvider = app.dal.accountPendTradeProvider
        this.accountTransferRecordProvider = app.dal.accountTransferRecordProvider
    }

    /**
     * 支付
     * @param fromAccountInfo 付款方账户
     * @param toAccountInfo 收款方账户
     * @param password 支付密码
     * @param amount 金额
     * @param paymentType 支付类型(1:合同)
     * @param outsideTradeNo 外部单号(要求唯一)
     * @param remark 备注
     * @returns {Promise<*>}
     */
    async payment({fromAccountInfo, toAccountInfo, password, amount, paymentType, outsideTradeNo, outsideTradeDesc, remark}) {

        const {result} = await this._transfer({
            fromAccountInfo, toAccountInfo, password, amount, tradeType: tradeType.Payment
        })

        if (!result) {
            throw new ApplicationError(this.ctx.gettext('transfer-exception-error'))
        }

        const paymentOrderId = uuid.v4().replace(/-/g, '')
        const paymentOrderInfo = {
            paymentOrderId, paymentType, amount, remark, outsideTradeNo, outsideTradeDesc,
            operationUserId: this.userId,
            accountId: fromAccountInfo.accountId,
            toAccountId: toAccountInfo.accountId,
            tradeStatus: tradeStatus.Successful,
            createDate: new Date().toISOString(),
            tradePoundage: 0
        }
        paymentOrderSecurity.paymentOrderSignature(paymentOrderInfo)

        return this.paymentOrderProvider.create(paymentOrderInfo).then(orderInfo => {
            this.app.emit(accountEvent.accountPaymentEvent, {
                fromAccountInfo, toAccountInfo, paymentOrderInfo: orderInfo
            })
            return orderInfo
        }).catch(error => {
            this.app.logger.error(`交易成功,但是创建支付订单失败`, paymentOrderInfo)
            throw error
        })
    }

    /**
     * 问询支付(发起确认函)
     */
    async inquirePayment({fromAccountInfo, toAccountInfo, password, amount, paymentType, outsideTradeNo, outsideTradeDesc, remark}) {

        const {app} = this
        await this._checkTransferAuthorization({
            accountInfo: fromAccountInfo,
            amount, password, tradeType: tradeType.Payment
        })
        this._checkTransferAmount({fromAccountInfo, amount})
        this._checkTransferAccountStatus({fromAccountInfo, toAccountInfo})

        await this.accountProvider.findOneAndUpdate({accountId: fromAccountInfo.accountId}, {$inc: {freezeBalance: amount}}, {new: true}).then(accountInfo => {
            this._signAccountInfo(accountInfo)
            return accountInfo.updateOne({signature: accountInfo.signature})
        })

        const paymentOrderId = uuid.v4().replace(/-/g, '')
        const paymentOrderInfo = {
            paymentOrderId, paymentType, amount, remark, outsideTradeNo, outsideTradeDesc,
            operationUserId: this.ctx.request.userId,
            accountId: fromAccountInfo.accountId,
            toAccountId: toAccountInfo.accountId,
            createDate: new Date().toISOString(),
            tradeStatus: tradeStatus.Pending, tradePoundage: 0
        }

        paymentOrderSecurity.paymentOrderSignature(paymentOrderInfo)

        return this.paymentOrderProvider.create(paymentOrderInfo).tap(paymentOrderInfo => {
            app.emit(accountEvent.emitInquirePaymentEvent, paymentOrderInfo)
        })
    }

    /**
     * 充值
     */
    async recharge({accountInfo, cardNo, amount, password}) {

        const {app, userId} = this
        const {accountId, currencyType} = accountInfo
        const paymentService = new PaymentService(app, currencyType)

        //后续需要做安全性检查,限额检查,以及用户认证检查等
        const outsideTradeInfo = await paymentService.recharge({fromCardNo: cardNo, amount, password})
        if (outsideTradeInfo.tradeStatus !== tradeStatus.Pending) {
            console.log('待实现.目前没有同步场景')
            return
        }

        const model = {
            accountId, amount, userId, currencyType, cardNo,
            outsideTradeId: outsideTradeInfo.tradeNumber,
            tradeStatus: outsideTradeInfo.tradeStatus
        }

        return this.accountPendTradeProvider.create(model)
    }

    /**
     * 转账
     */
    async transfer({fromAccountInfo, toAccountInfo, password, amount, remark}) {

        const transferRecordInfo = await this.accountTransferRecordProvider.create({
            transferId: uuid.v4().replace(/-/g, ''),
            fromAccountId: fromAccountInfo.accountId,
            toAccountId: toAccountInfo.accountId,
            operationUserId: this.userId,
            tradePoundage: 0,
            tradeStatus: tradeStatus.Pending,
            amount, remark,
        })
        const {result} = await this._transfer({
            fromAccountInfo, toAccountInfo, password, amount, tradeType: tradeType.Transfer
        })
        transferRecordInfo.tradeStatus = result ? tradeStatus.Successful : tradeStatus.Failed
        transferRecordInfo.updateOne({tradeStatus: transferRecordInfo.tradeStatus})
        if (result) {
            this.app.emit(accountEvent.accountTransferEvent, {transferRecordInfo, fromAccountInfo, toAccountInfo})
        }
        return transferRecordInfo
    }

    /**
     * 问询转账(发起确认函)
     */
    async inquireTransfer({fromAccountInfo, toAccountInfo, authCode, transferType, amount, remark, refParam}) {

        if (transferType === 2) {
            amount = fromAccountInfo.balance
        }

        await this._checkTransferAuthorization({
            accountInfo: fromAccountInfo, amount, password: authCode, tradeType: tradeType.Transfer, transferType
        })

        this._checkTransferAmount({fromAccountInfo, amount})
        this._checkTransferAccountStatus({fromAccountInfo, toAccountInfo})

        const transferRecordInfo = await this.accountTransferRecordProvider.create({
            transferId: uuid.v4().replace(/-/g, ''),
            fromAccountId: fromAccountInfo.accountId,
            toAccountId: toAccountInfo.accountId,
            operationUserId: this.userId,
            tradePoundage: 0,
            tradeStatus: tradeStatus.Pending,
            amount, remark
        })

        await this.accountProvider.findOneAndUpdate({accountId: fromAccountInfo.accountId}, {$inc: {freezeBalance: amount}}, {new: true}).then(accountInfo => {
            this._signAccountInfo(accountInfo)
            return accountInfo.updateOne({signature: accountInfo.signature})
        })

        this.app.emit(accountEvent.emitInquireTransferEvent, transferRecordInfo, refParam)

        return transferRecordInfo
    }

    /**
     * 官方给用户tap货币
     * @param currencyType
     * @param cardNo
     * @returns {Promise<void>}
     */
    async tap({currencyType, cardNo}) {

        const {app} = this
        if (currencyType !== CurrencyTypeEnum.ETH) {
            throw new ApplicationError(ctx.gettext('official-tap-limit-tips'))
        }
        /**
         * TODO:后续需要在业务中自动判断是否tap过.
         */
        const paymentService = new PaymentService(app, currencyType)

        return paymentService.tap(cardNo)
    }

    /**
     * 账户之间的转账
     * @private
     */
    async _transfer({fromAccountInfo, toAccountInfo, password, amount, tradeType}) {

        const {app} = this
        await this._checkTransferAuthorization({accountInfo: fromAccountInfo, amount, password, tradeType})
        this._checkTransferAmount({fromAccountInfo, amount})
        this._checkTransferAccountStatus({fromAccountInfo, toAccountInfo})

        const task1 = this.accountProvider.findOneAndUpdate({accountId: fromAccountInfo.accountId}, {$inc: {balance: -amount}}, {new: true})
        const task2 = this.accountProvider.findOneAndUpdate({accountId: toAccountInfo.accountId}, {$inc: {balance: amount}}, {new: true})

        return Promise.all([task1, task2]).catch(error => {
            app.logger.error("account-transfer-exception", error, fromAccountInfo, toAccountInfo)
            throw error
        }).then(([fromAccountInfo, toAccountInfo]) => {
            this._signAccountInfo(fromAccountInfo, toAccountInfo)
            const task3 = toAccountInfo.updateOne({signature: toAccountInfo.signature})
            const task4 = fromAccountInfo.updateOne({signature: fromAccountInfo.signature})
            Promise.all([task3, task4]).catch(error => {
                app.logger.error("account-transfer-signature-exception", error, fromAccountInfo, toAccountInfo)
            })
            return {result: true, fromAccountInfo, toAccountInfo}
        })
    }

    /**
     * 检查账户余额是否能够完成本次转账
     * @param fromAccountInfo
     * @param amount
     * @private
     */
    _checkTransferAmount({fromAccountInfo, amount}) {

        const {ctx} = this
        const availableAmount = fromAccountInfo.balance - fromAccountInfo.freezeBalance

        if (amount <= 0) {
            throw new ApplicationError(ctx.gettext('params-validate-failed', 'amount'), {amount})
        }
        if (amount > fromAccountInfo.balance) {
            throw new ApplicationError(ctx.gettext('transaction-account-balance-insufficient-error'), {
                balance: fromAccountInfo.balance,
                freezeBalance: fromAccountInfo.freezeBalance
            })
        }
        if (amount > availableAmount) {
            throw new ApplicationError(ctx.gettext('transaction-account-balance-insufficient-error'), {
                balance: fromAccountInfo.balance,
                freezeBalance: fromAccountInfo.freezeBalance
            })
        }
        return true
    }

    /**
     * 检查交易双方的账户信息
     * @private
     */
    _checkTransferAccountStatus({fromAccountInfo, toAccountInfo}) {

        if (fromAccountInfo.accountId === toAccountInfo.accountId) {
            throw new ApplicationError('发起方账户与收款方账户不能一致')
        }
        if (fromAccountInfo.currencyType !== toAccountInfo.currencyType) {
            throw new ApplicationError('发起方账户与收款方账户币种不一致,无法执行交易操作')
        }
        if (fromAccountInfo.status !== 1) {
            throw new ApplicationError(`发起方账户状态异常,status:${fromAccountInfo.status}`)
        }
        if (toAccountInfo.status !== 1) {
            throw new ApplicationError(`收款方账户状态异常,status:${toAccountInfo.status}`)
        }
        if (toAccountInfo.status === 5 || fromAccountInfo.status === 5) {
            throw new ApplicationError('账户正在进行其他交易中,请稍后再试')
        }
        if (!accountInfoSecurity.accountSignVerify(fromAccountInfo)) {
            throw new ApplicationError('发起方账户数据异常,请联系客服')
        }
        if (!accountInfoSecurity.accountSignVerify(toAccountInfo)) {
            throw new ApplicationError('收款方账户数据异常,请联系客服')
        }
        return true
    }

    /**
     * 签名账户信息
     * @param accountInfo
     * @returns {*}
     * @private
     */
    _signAccountInfo(...args) {
        args.length && args.forEach(accountInfo => accountInfoSecurity.accountInfoSignature(accountInfo))
        return args.length > 0
    }

    /**
     * 检查账户交易授权信息
     * @param fromAccountInfo
     * @private
     */
    async _checkTransferAuthorization({accountInfo, amount, password, tradeType, transferType}) {

        const {userId} = this
        const params = {accountInfo, userId, password, amount, tradeType, transferType}
        const {authResult, message} = await accountAuthorization.authorization(params)

        if (!authResult) {
            throw new ApplicationError(message || '授权错误')
        }
    }
}