'use strict'

const Web3 = require('web3')
const client = Symbol('web3#client')
const coinContractSymbol = Symbol('web3#coinContract')
const OfficialOpsSymbol = Symbol('web3#OfficialOps')

module.exports = class Web3Client {

    constructor(config) {
        const {ethereum} = config
        this.accountInfo = ethereum.account
        const web3 = this[client] = new Web3(new Web3.providers.HttpProvider(ethereum.web3RpcUri));
        this[coinContractSymbol] = new web3.eth.Contract(ethereum.Coin.abi, ethereum.Coin.address)
        this[OfficialOpsSymbol] = new web3.eth.Contract(ethereum.OfficialOps.abi, ethereum.OfficialOps.address)
    }

    /**
     * 以太坊货币合同
     * @returns {*}
     */
    get CoinContract() {
        return this[coinContractSymbol]
    }


    /**
     * 以太坊官方管理合同
     * @returns {*}
     */
    get OfficialOpsContract() {
        return this[OfficialOpsSymbol]
    }

    /**
     * 获取eth客户端
     * @returns {*}
     */
    get client() {
        return this[client]
    }

    /**
     * 获取eth客户端
     * @returns {*}
     */
    get web3() {
        return this[client]
    }

    /**
     * 获取当前系统管理员账户信息
     * @returns {{from: string}}
     */
    get adminInfo() {
        return {from: this.accountInfo.admin}
    }

    /**
     * 飞致网络平台账号(非官方管理资金池账号)
     * @returns {string}
     */
    get platformAccountAddress() {
        return this.accountInfo.freelog
    }
}
