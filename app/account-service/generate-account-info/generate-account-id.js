'use strict'

const uuid = require('uuid')
const lodash = require('lodash')
const accountTypeEnum = require('../../enum/account-type')
const currencyTypeEnum = require('../../enum/currency-type')
const commRegex = require('egg-freelog-base/app/extend/helper/common_regex')
const cryptoHelper = require('egg-freelog-base/app/extend/helper/crypto_helper')
const CurrencyTypePrefix = lodash.invert(currencyTypeEnum)

module.exports = class GenerateAccountId {

    /**
     * 生成飞致平台账户
     * @param currencyType
     * @returns {string}
     */
    generateAccountId({currencyType, accountType}) {

        const currencyTypePrefix = CurrencyTypePrefix[currencyType]
        const accountNum = cryptoHelper.sha512(uuid.v4()).substr(0, 8) //使用sha算法保证字符在各个段位分配平均
        const numberSections = this._getNumberSection(accountType)
        const numberSection = numberSections[lodash.random(0, numberSections.length - 1)]
        const accountId = `f${currencyTypePrefix}${numberSection}${accountNum}`.toLowerCase()

        if (!commRegex.transferAccountId.test(accountId)) {
            throw Error("账户生成失败")
        }

        return accountId
    }

    /**
     * 获取号段
     * @param accountType
     */
    _getNumberSection(accountType) {
        if (accountType === accountTypeEnum.IndividualAccount) {
            return ['233', '109', '331', '209', '102']
        }
        else if (accountType === accountTypeEnum.ContractAccount) {
            return ['212', '305', '816', '573', '119']
        }
        else if (accountType === accountTypeEnum.NodeAccount) {
            return ['706', '912', '107', '227', '339']
        }
        else {
            return ['000']
        }
    }
}