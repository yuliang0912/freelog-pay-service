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

        this.app.on('error', this.appEventErrorHandler)

        //侦听内部账户事件
        this.app.on(accountPaymentEvent, this.eventHandler(accountPaymentEvent))
        this.app.on(accountTransferEvent, this.eventHandler(accountTransferEvent))
        this.app.on(accountAmountChangedEvent, this.eventHandler(accountAmountChangedEvent))
        this.app.on(accountRechargeCompletedEvent, this.eventHandler(accountRechargeCompletedEvent))
        this.app.on(accountSignatureVerifyFailedEvent, this.eventHandler(accountSignatureVerifyFailedEvent))

        //外部交易事件
        this.app.on(featherTransferEvent, this.eventHandler(featherTransferEvent))
    }

    /**
     * 获取事件处理者
     * @param eventName
     * @returns {*}
     */
    eventHandler(eventName) {

        const eventHandler = this.patrun.find({event: eventName.toString()})
        if (!eventHandler) {
            throw new Error(`尚未注册事件${eventName}的处理者`)
        }

        return function () {
            //console.log('接收到事件:', eventName, ...arguments)
            return eventHandler.handler(...arguments)
        }
    }

    /**
     * app-error事件处理
     * @param error
     */
    appEventErrorHandler(error) {
        console.log('app-event-error', error)
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