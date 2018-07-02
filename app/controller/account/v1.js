'use strict'

const Controller = require('egg').Controller
const accountHelper = require('../../extend/helper/account-generate-helper')

module.exports = class AccountController extends Controller {

    /**
     * 我的账户列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const accountType = ctx.checkQuery('accountType').optional().in([1, 2, 3, 4]).toInt().value

        ctx.validate()

        const condition = {
            userId: ctx.request.userId
        }
        if (accountType) {
            condition.accountType = accountType
        }

        await ctx.dal.accountProvider.getAccountList(condition).then(ctx.success)
    }

    /**
     * 获取账户详情
     * @param ctx
     * @returns {Promise<void>}
     */
    async show(ctx) {

        const accountId = ctx.checkParams('id').match(accountHelper.verify, '账户格式错误').value
        ctx.validate()

        await ctx.dal.accountProvider.getAccount({
            accountId, userId: ctx.request.userId
        }).then(ctx.success)
    }


    /**
     * 创建eth账户
     * @param ctx
     * @returns {Promise<void>}
     */
    async createEthAccount(ctx) {

        const password = ctx.checkBody('password').exist().len(6).value;

        ctx.allowContentType({type: 'json'}).validate()

        const ethAddress = await ctx.dal.ethProvider.createEthAddress(ctx.request.userId, password)

        ctx.success({userId: ethAddress.userId, address: ethAddress.address})
    }


    /**
     * 下载keystore文件
     * @param ctx
     * @returns {Promise<void>}
     */
    async downLoadKeyStore(ctx) {

        const address = ctx.checkQuery('address').len(42, 42).value
        ctx.validate()

        const ethAddressInfo = await ctx.dal.ethProvider.getEthAddress({address: address})

        if (!ethAddressInfo || ethAddressInfo.userId != ctx.request.userId) {
            ctx.error({msg: '无效的卡号'})
        }
        if (ethAddressInfo.status == 2) {
            ctx.error({msg: '当前地址的keystore已经清理,无法下载'})
        }

        await ctx.curl(ethAddressInfo.keyStoreUrl, {streaming: true,}).then(result => {
            if (!/^2[\d]{2}$/.test(result.status)) {
                ctx.error({msg: '文件获取失败,未能获取到资源源文件信息', data: {['http-status']: result.status}})
            }
            ctx.set('content-disposition', 'attachment;filename=' + address)
            ctx.body = result.res;
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

        const ethAddressInfo = await ctx.dal.ethProvider.getEthAddress({address: address})
        if (!ethAddressInfo || ethAddressInfo.userId != ctx.request.userId) {
            ctx.error({msg: '无效的卡号'})
        }
        if (ethAddressInfo.status == 2) {
            ctx.error({msg: '当前地址的keystore已经清理,不能重复操作'})
        }

        await ctx.app.ossClient.deleteFile(ethAddressInfo.objectKey)
        await ctx.dal.ethProvider.updateEthAddress({
            keyStoreUrl: '',
            status: 2
        }, {address: address}).then(() => ctx.success(true))
    }


    /**
     * 创建freelog账户
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {

        const accountType = ctx.checkBody('accountType').exist().in([1, 2, 3, 4]).toInt().value
        const address = ctx.checkBody('address').optional().len(42, 42).value

        ctx.allowContentType({type: 'json'}).validate()

        await ctx.dal.accountProvider.count({accountType, userId: ctx.request.userId}).then(count => {
            count >= 5 && ctx.error({msg: `当前用户的${accountType}类型账户数量已经达到上限,无法创建`})
        })

        address && await ctx.dal.accountProvider.count({cardNo: address}).then(count => {
            count && ctx.error({msg: '当前address已经绑定到其他账号,无法重新绑定'})
        })

        await ctx.dal.accountProvider.createAccount({
            accountType: accountType,
            cardNo: address || '',
            userId: ctx.request.userId
        }).then(ctx.success)
    }

    /**
     * 获取余额
     * @param ctx
     * @returns {Promise<void>}
     */
    async balance(ctx) {

        const accountId = ctx.checkParams('accountId').match(accountHelper.verify, '账户格式错误').value

        ctx.validate()

        const {ethClient} = ctx.app
        const accountInfo = await ctx.dal.accountProvider.getAccount({
            accountId, userId: ctx.request.userId
        })
        if (!accountInfo) {
            ctx.error({msg: `未找到用户账号${accountId}`})
        }
        if (accountInfo.status !== 1) {
            ctx.error({msg: `账户状态异常,status:${accountInfo.status}`})
        }

        if (accountInfo.accountType !== 1) {
            return ctx.success({
                accountId,
                accountType: accountInfo.accountType,
                balance: accountInfo.balance
            })
        }

        await ethClient.CoinContract.methods.balanceOf(accountInfo.cardNo).call(ethClient.adminInfo).then(balanceOf => ctx.success({
            accountId,
            accountType: accountInfo.accountType,
            balance: balanceOf
        }))
    }

    /**
     * 给账户初始化一笔feather
     * @returns {Promise<void>}
     */
    async officaialTap(ctx) {

        const accountId = ctx.checkQuery('accountId').match(accountHelper.verify, '账户格式错误').value
        ctx.validate()

        const {ethClient} = ctx.app
        const accountInfo = await ctx.dal.accountProvider.getAccount({
            accountId, userId: ctx.request.userId
        })
        if (!accountInfo) {
            ctx.error({msg: `未找到用户账号${accountId}`})
        }
        if (accountInfo.accountType !== 1) {
            ctx.error({msg: `账户类型错误`})
        }

        const task = ethClient.OfficaialOpsContract.methods.tap(accountInfo.cardNo, 100000).send(ethClient.adminInfo)

        await new Promise((resolve, reject) => {
            task.on('transactionHash', resolve).catch(reject)
        }).then(ctx.success).catch(ctx.error)
    }
}