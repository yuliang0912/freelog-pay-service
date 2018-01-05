'use strict'

const uuid = require('node-uuid')
const cryptoHelper = require('egg-freelog-base/app/extend/helper/crypto_helper')
const numberSections = [233, 109, 331, 209, 102]
const accountTypePrefix = {
    "1": "feth",
    "2": "fcny",
    "3": 'fusd',
    "4": 'feur'
}

const obj = module.exports = {

    //生成账户前缀
    generateAccountPrefix(accountType) {

        let numberSection = numberSections[parseInt(Math.random() * 100000000) % 5]

        return accountTypePrefix[accountType] + numberSection
    },


    //生成账户
    generateAccount(accountType) {

        let accountNum = cryptoHelper.sha512(uuid.v4()).substr(0, 8)

        let accountId = obj.generateAccountPrefix(accountType) + accountNum;

        if (accountId.length != 15) {
            throw Error("账户生成失败")
        }

        return accountId
    },



    verify: /^(feth|fcny|fusd|feur)\d{3}[a-fA-F0-9]{8}$/
}