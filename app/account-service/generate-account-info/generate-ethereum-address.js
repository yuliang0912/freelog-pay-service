'use strict'

const globalInfo = require('egg-freelog-base/globalInfo')

module.exports = class GenerateEthereumAddress {

    /**
     * 创建生成以太坊地址(公私钥)
     */
    generateEthereumAddress(password) {

        const {ethClient} = globalInfo.app

        const account = ethClient.web3.eth.accounts.create()
        const keyStore = account.encrypt(password)

        if (!ethClient.web3.utils.isAddress(account.address)) {
            throw new Error('创建以太坊钱包地址出错')
        }

        return {address: account.address, password, keyStore}
    }
}
