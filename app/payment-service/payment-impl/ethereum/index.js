'use strict'

const IPayment = require('../../payment-interface')
const tradeStatus = require('../../../enum/trade-status')
const currencyType = require('../../../enum/currency-type')
const {ApplicationError} = require('egg-freelog-base/error')

module.exports = class EthereumPayment extends IPayment {

    constructor(app) {
        super(currencyType.ETH)
        this.app = app
    }

    /**
     * 支付接口
     * @param fromCardNo
     * @param toCardNo
     * @param amount
     * @param password
     * @param remark
     * @returns {Promise<void>}
     */
    async payment({fromCardNo, toCardNo, amount, password, remark}) {

        const {ethClient} = this.app

        if (!ethClient.web3.utils.isAddress(fromCardNo)) {
            throw new ApplicationError(`交易卡号错误`, {fromCardNo})
        }
        if (!ethClient.web3.utils.isAddress(toCardNo)) {
            throw new ApplicationError(`交易卡号错误`, {toCardNo})
        }

        const {balance} = await this._getBalance(fromCardNo)
        if (balance < amount) {
            throw new ApplicationError('余额不足本次支付,交易失败')
        }
        if (remark == null || remark === undefined) {
            remark = 'payment'
        }

        return this._officialTransfer({fromAddress: fromCardNo, toAddress: toCardNo, value: amount, data: remark})
    }

    /**
     * 官方给账户初始化金额
     * @param address
     * @returns {Promise<any>}
     */
    async tap(address) {

        const {ethClient} = this.app
        const {OfficialOpsContract, adminInfo} = ethClient

        const sendToEthTask = OfficialOpsContract.methods.tap(address, 100000).send(adminInfo)

        return new Promise((resolve, reject) => sendToEthTask.on('transactionHash', resolve).catch(reject))
    }

    /**
     * 充值(充值到平台的托管飞致币账户)
     * @param fromCardNo
     * @param amount
     * @param password
     * @returns {Promise<void>}
     */
    async recharge({fromCardNo, amount, password}) {

        const {ethClient} = this.app

        if (!ethClient.web3.utils.isAddress(fromCardNo)) {
            throw new ApplicationError(`交易卡号错误`, {fromCardNo})
        }

        const {balance} = await this._getBalance(fromCardNo)

        if (balance < amount) {
            throw new ApplicationError('余额不足本次支付,交易失败')
        }

        return this._officialTransfer({
            fromAddress: fromCardNo,
            toAddress: ethClient.platformAccountAddress,
            value: amount,
            data: 'recharge'
        })
    }

    /**
     * 获取余额
     * @param address
     * @private
     */
    _getBalance(address) {

        const {ethClient} = this.app
        const {CoinContract, adminInfo} = ethClient

        return CoinContract.methods.balanceOf(address).call(adminInfo).then(balance => new Object({
            address, balance
        }))
    }

    /**
     * 官方交易
     */
    _officialTransfer({fromAddress, toAddress, value, data}) {

        const {ethClient} = this.app
        const {OfficialOpsContract, adminInfo} = ethClient

        if (data) {
            data = ethClient.web3.utils.asciiToHex(data)
        }

        const sendToEthTask = OfficialOpsContract.methods.officialTransfer(fromAddress, toAddress, value, data).send(adminInfo)

        return new Promise((resolve, reject) => sendToEthTask.on('transactionHash', (hash) => {
            resolve({tradeNumber: hash, tradeStatus: tradeStatus.Pending})
        }).catch(reject))
    }
}
