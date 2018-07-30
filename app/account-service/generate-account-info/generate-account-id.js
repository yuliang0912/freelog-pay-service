'use strict'

const uuid = require('uuid')
const lodash = require('lodash')
const CurrencyType = require('../../enum/currency-type')
const commRegex = require('egg-freelog-base/app/extend/helper/common_regex')
const cryptoHelper = require('egg-freelog-base/app/extend/helper/crypto_helper')


const NumberSections = [233, 109, 331, 209, 102]
const CurrencyTypePrefix = lodash.invert(CurrencyType)

module.exports = class GenerateAccountId {

    /**
     * 生成飞致平台账户
     * @param currencyType
     * @returns {string}
     */
    generateAccountId(currencyType) {

        const currencyTypePrefix = CurrencyTypePrefix[currencyType]
        const accountNum = cryptoHelper.sha512(uuid.v4()).substr(0, 8) //使用sha算法保证字符在各个段位分配平均
        const numberSection = NumberSections[parseInt(Math.random() * 10000) % NumberSections.length]

        const accountId = `f${currencyTypePrefix}${numberSection}${accountNum}`.toLowerCase()

        if (!commRegex.transferAccountId.test(accountId)) {
            throw Error("账户生成失败")
        }

        return accountId
    }
}