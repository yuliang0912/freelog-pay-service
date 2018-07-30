'use strict'

const GenerateAccountId = require('./generate-account-id')
const GenerateEthereumAddress = require('./generate-ethereum-address')
const GenerateAccountPassword = require('./generate-account-password')

module.exports = {

    /**
     * 生成账户ID
     */
    accountIdGenerator: new GenerateAccountId(),

    /**
     * 生成与校验账户密码
     */
    accountPasswordGenerator: new GenerateAccountPassword(),

    /**
     * 生成eth信息
     */
    ethereumGenerator: new GenerateEthereumAddress()

}

