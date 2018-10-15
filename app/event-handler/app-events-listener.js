/**
 * 飞致平台支付账户事件侦听
 */

'use strict'

const Patrun = require('patrun')
const {accountEvent, outsideTradeEvent} = require('../enum/index')
const AccountPaymentEventHandler = require('./account-events-handler/payment-event-handler')
const AccountTransferEventHandler = require('./account-events-handler/transfer-event-handler')
const AccountAmountChangedEventHandler = require('./account-events-handler/amount-changed-event-handler')
const EmitInquirePaymentEventHandler = require('./account-events-handler/emit-inquire-payment-event-handler')
const EmitInquireTransferEventHandler = require('./account-events-handler/emit-inquire-transfer-event-handler')
const AccountRechargeCompletedEventHandler = require('./account-events-handler/recharge-completed-event-handler')
const AccountSignatureVerifyFailedEventHandler = require('./account-events-handler/signature-verify-failed-event-handler')
const FeatherTransferEventHandler = require('./outside-account-events-handler/feather-transfer-event-handler')
const ObtainInquirePaymentResultEventHandler = require('./outside-account-events-handler/obtain-inquire-payment-result-event-handler')
const ObtainInquireTransferResultEventHandler = require('./outside-account-events-handler/obtain-inquire-transfer-result-event-handler')

module.exports = class AppEventsListener {

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

        const {featherTransferEvent, obtainInquirePaymentResultEvent, obtainInquireTransferResultEvent} = outsideTradeEvent
        const {
            accountRechargeCompletedEvent, accountAmountChangedEvent, accountSignatureVerifyFailedEvent,
            accountTransferEvent, accountPaymentEvent, emitInquirePaymentEvent, emitInquireTransferEvent
        } = accountEvent

        //注册内部账户事件
        this.registerEventAndHandler(accountPaymentEvent)
        this.registerEventAndHandler(accountTransferEvent)
        this.registerEventAndHandler(emitInquirePaymentEvent)
        this.registerEventAndHandler(emitInquireTransferEvent)
        this.registerEventAndHandler(accountAmountChangedEvent)
        this.registerEventAndHandler(accountRechargeCompletedEvent)
        this.registerEventAndHandler(accountSignatureVerifyFailedEvent)

        //注册外部交易事件
        this.registerEventAndHandler(featherTransferEvent)
        this.registerEventAndHandler(obtainInquirePaymentResultEvent)
        this.registerEventAndHandler(obtainInquireTransferResultEvent)
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

        const {patrun, app} = this

        const {featherTransferEvent, obtainInquirePaymentResultEvent, obtainInquireTransferResultEvent} = outsideTradeEvent
        const {
            accountRechargeCompletedEvent, accountAmountChangedEvent, accountSignatureVerifyFailedEvent,
            accountTransferEvent, accountPaymentEvent, emitInquirePaymentEvent, emitInquireTransferEvent
        } = accountEvent

        //内部账户事件注册
        patrun.add({event: accountPaymentEvent.toString()}, new AccountPaymentEventHandler(app))
        patrun.add({event: accountTransferEvent.toString()}, new AccountTransferEventHandler(app))
        patrun.add({event: emitInquirePaymentEvent.toString()}, new EmitInquirePaymentEventHandler(app))
        patrun.add({event: emitInquireTransferEvent.toString()}, new EmitInquireTransferEventHandler(app))

        patrun.add({event: accountAmountChangedEvent.toString()}, new AccountAmountChangedEventHandler(app))
        patrun.add({event: accountRechargeCompletedEvent.toString()}, new AccountRechargeCompletedEventHandler(app))
        patrun.add({event: accountSignatureVerifyFailedEvent.toString()}, new AccountSignatureVerifyFailedEventHandler(app))

        //外部交易事件注册
        patrun.add({event: featherTransferEvent.toString()}, new FeatherTransferEventHandler(app))
        patrun.add({event: obtainInquirePaymentResultEvent.toString()}, new ObtainInquirePaymentResultEventHandler(app))
        patrun.add({event: obtainInquireTransferResultEvent.toString()}, new ObtainInquireTransferResultEventHandler(app))
    }
}