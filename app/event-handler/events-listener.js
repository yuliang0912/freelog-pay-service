/**
 * 飞致平台支付账户事件侦听
 */

'use strict'

const Patrun = require('patrun')
const {accountEvent, outsideTradeEvent} = require('../enum/index')
const AccountPaymentEventHandler = require('./account-events-handler/payment-event-handler')
const AccountTransferEventHandler = require('./account-events-handler/transfer-event-handler')
const AccountAmountChangedEventHandler = require('./account-events-handler/amount-changed-event-handler')
const AccountRechargeCompletedEventHandler = require('./account-events-handler/recharge-completed-event-handler')
const AccountSignatureVerifyFailedEventHandler = require('./account-events-handler/signature-verify-failed-event-handler')
const FeatherTransferEventHandler = require('./outside-account-events-handler/feather-transfer-event-handler')

module.exports = class EventsListener {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.registerEventHandler()
        this.registerEventListener()
    }

    /**
     * 注册事件侦听者
     */
    registerEventListener() {

        const {featherTransferEvent} = outsideTradeEvent
        const {accountRechargeCompletedEvent, accountAmountChangedEvent, accountSignatureVerifyFailedEvent, accountTransferEvent, accountPaymentEvent} = accountEvent

        //注册内部账户事件
        this.registerEventAndHandler(accountPaymentEvent)
        this.registerEventAndHandler(accountTransferEvent)
        this.registerEventAndHandler(accountAmountChangedEvent)
        this.registerEventAndHandler(accountRechargeCompletedEvent)
        this.registerEventAndHandler(accountSignatureVerifyFailedEvent)

        //注册外部交易事件
        this.registerEventAndHandler(featherTransferEvent)
    }

    /**
     * 注册事件以及事件处理者
     * @param eventName
     */
    registerEventAndHandler(eventName) {

        const eventHandler = this.patrun.find({event: eventName.toString()})
        if (!eventHandler) {
            throw new Error(`尚未注册事件${eventName}的处理者`)
        }

        this.app.on(eventName, (...args) => eventHandler.handler(...args))
    }

    /**
     * 注册事件处理者
     */
    registerEventHandler() {

        const {patrun} = this

        const {featherTransferEvent} = outsideTradeEvent
        const {accountRechargeCompletedEvent, accountAmountChangedEvent, accountSignatureVerifyFailedEvent, accountTransferEvent, accountPaymentEvent} = accountEvent

        //内部账户事件注册
        patrun.add({event: accountPaymentEvent.toString()}, new AccountPaymentEventHandler(this.app))
        patrun.add({event: accountTransferEvent.toString()}, new AccountTransferEventHandler(this.app))
        patrun.add({event: accountAmountChangedEvent.toString()}, new AccountAmountChangedEventHandler(this.app))
        patrun.add({event: accountRechargeCompletedEvent.toString()}, new AccountRechargeCompletedEventHandler(this.app))
        patrun.add({event: accountSignatureVerifyFailedEvent.toString()}, new AccountSignatureVerifyFailedEventHandler(this.app))

        //外部交易事件注册
        patrun.add({event: featherTransferEvent.toString()}, new FeatherTransferEventHandler(this.app))
    }
}