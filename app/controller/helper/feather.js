'use strict'

const Controller = require('egg').Controller
const {ethereumGenerator} = require('../../account-service/generate-account-info/index')
const {ApplicationError, ArgumentError, AuthorizationError} = require('egg-freelog-base/error')

module.exports = class FeatherController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.ethKeyStoreProvider = app.dal.ethKeyStoreProvider
    }

    /**
     * 创建eth地址
     * @param ctx
     * @returns {Promise<void>}
     */
    async createEthAddress(ctx) {

        const password = ctx.checkBody('password').exist().len(6).value;
        ctx.allowContentType({type: 'json'}).validate()

        const userId = ctx.request.userId
        const ethAddressInfo = ethereumGenerator.generateEthereumAddress(password)

        await this.ethKeyStoreProvider.saveEthAddressInfo({ethAddressInfo, userId})

        ctx.success({userId, address: ethAddressInfo.address})
    }

    /**
     * 下载keystore文件
     * @param ctx
     * @returns {Promise<void>}
     */
    async downLoadKeyStore(ctx) {

        const address = ctx.checkQuery('address').len(42, 42).value
        ctx.validate()

        const ethAddressInfo = await this.ethKeyStoreProvider.findOne({address}).tap(model => ctx.entityNullValueAndUserAuthorizationCheck(model, {
            msg: ctx.gettext('params-validate-failed', 'address')
        }))

        if (ethAddressInfo.status == 2) {
            throw new ApplicationError(ctx.gettext('eth-keystore-cleared-tips'))
        }

        await ctx.curl(ethAddressInfo.keyStoreUrl, {streaming: true,}).then(result => {
            if (!/^2[\d]{2}$/.test(result.status)) {
                throw new ApplicationError('oss-fetch-file-failed', {['http-status']: result.status})
            }
            ctx.attachment(address)
            ctx.body = result.res
        })
    }

    /**
     * 清理keystore信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async clearKeyStore(ctx) {

        const address = ctx.checkQuery('address').len(42, 42).value
        ctx.validate()

        const ethAddressInfo = await this.ethKeyStoreProvider.findOne({address}).tap(model => ctx.entityNullValueAndUserAuthorizationCheck(model, {
            msg: ctx.gettext('params-validate-failed', 'address')
        }))

        if (ethAddressInfo.status === 2) {
            return ctx.success(true)
        }

        await this.ethKeyStoreProvider.updateOne({address}, {
            objectKey: '', keyStoreUrl: '', status: 2
        }).then(() => ctx.success(true))

        await ctx.app.ossClient.deleteFile(ethAddressInfo.objectKey)
    }

    /**
     * 以太坊上的交易原始信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async ethTransactionReceipt(ctx) {

        const transactionId = ctx.checkQuery("transactionId").exist().len(24, 70).value

        ctx.validate()

        const transaction = await ctx.app.ethClient.web3.eth.getTransaction(transactionId).catch(ctx.error)

        ctx.success(transaction)
    }

    /**
     * 余额
     * @param ctx
     * @returns {Promise<void>}
     */
    async balance(ctx) {

        const address = ctx.checkQuery('address').len(42, 42).value
        ctx.validate()

        const {ethClient} = ctx.app
        const {CoinContract, adminInfo} = ethClient
        await CoinContract.methods.balanceOf(address).call(adminInfo).then(balance => new Object({
            address, balance: parseInt(balance)
        })).then(ctx.success)
    }

    /**
     * feather赠送记录
     * @param ctx
     * @returns {Promise<void>}
     */
    async tapRecord(ctx) {

        const address = ctx.checkQuery('address').len(42, 42).value
        ctx.validate()

        const {ethClient} = ctx.app
        const {OfficialOpsContract, adminInfo} = ethClient

        await OfficialOpsContract.methods.tapRecord(address).call(adminInfo).then(isTap => new Object({
            address, isTap
        })).then(ctx.success)
    }
}