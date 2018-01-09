'use strict'

const accountHelper = require('../../extend/helper/account-generate-helper')

module.exports = app => {

    const dataProvider = app.dataProvider

    return class AccountController extends app.Controller {


        /**
         * 我的账户列表
         * @param ctx
         * @returns {Promise<void>}
         */
        async index(ctx) {

            let accountType = ctx.checkQuery('accountType').optional().in([1, 2, 3, 4]).toInt().value

            ctx.validate(true)

            let condition = {
                userId: ctx.request.userId
            }

            if (accountType) {
                condition.accountType = accountType
            }

            await dataProvider.accountProvider.getAccountList(condition).then(list => {
                ctx.success(list)
            })
        }

        /**
         * 创建eth账户
         * @param ctx
         * @returns {Promise<void>}
         */
        async createEthAccount(ctx) {

            let password = ctx.checkBody('password').exist().len(6).value;

            ctx.allowContentType({type: 'json'}).validate()

            let ethAddress = await dataProvider.ethProvider.createEthAddress(ctx.request.userId, password)

            ctx.success({userId: ethAddress.userId, address: ethAddress.address})
        }


        /**
         * 下载keystore文件
         * @param ctx
         * @returns {Promise<void>}
         */
        async downLoadKeyStore(ctx) {
            let address = ctx.checkQuery('address').len(42, 42).value
            ctx.validate()

            let ethAddressInfo = await dataProvider.ethProvider.getEthAddress({address: address})

            if (!ethAddressInfo || ethAddressInfo.userId != ctx.request.userId) {
                ctx.error({msg: '无效的卡号'})
            }

            if (ethAddressInfo.status == 2) {
                ctx.error({msg: '当前地址的keystore已经清理,无法下载'})
            }

            await ctx.curl(ethAddressInfo.keyStoreUrl, {
                streaming: true,
            }).then(result => {
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

            let address = ctx.checkQuery('address').len(42, 42).value
            ctx.validate()

            let ethAddressInfo = await dataProvider.ethProvider.getEthAddress({address: address})

            if (!ethAddressInfo || ethAddressInfo.userId != ctx.request.userId) {
                ctx.error({msg: '无效的卡号'})
            }

            if (ethAddressInfo.status == 2) {
                ctx.error({msg: '当前地址的keystore已经清理,不能重复操作'})
            }

            await app.upload.deleteFile(ethAddressInfo.objectKey)
            await dataProvider.ethProvider.updateEthAddress({
                keyStoreUrl: '',
                status: 2
            }, {address: address}).then(() => {
                ctx.success(true)
            })
        }


        /**
         * 创建freelog账户
         * @param ctx
         * @returns {Promise<void>}
         */
        async create(ctx) {

            let accountType = ctx.checkBody('accountType').exist().in([1, 2, 3, 4]).toInt().value
            let address = ctx.checkBody('address').optional().len(42, 42).value

            ctx.allowContentType({type: 'json'}).validate()

            await dataProvider.ethProvider.count({accountType, userId: ctx.request.userId}).then(count => {
                count >= 5 && ctx.error({msg: `当前用户的${accountType}类型账户数量已经达到上限,无法创建`})
            })

            address && await dataProvider.accountProvider.count({cardNo: address}).then(count => {
                count && ctx.error({msg: '当前address已经绑定到其他账号,无法重新绑定'})
            })

            await dataProvider.accountProvider.createAccount({
                accountType: accountType,
                cardNo: address || '',
                userId: ctx.request.userId
            }).then(accountInfo => {
                ctx.success(accountInfo)
            })
        }

        /**
         * 获取余额
         * @param ctx
         * @returns {Promise<void>}
         */
        async balance(ctx) {


            let accountId = ctx.checkParams('accountId').match(accountHelper.verify, '账户格式错误').value

            ctx.validate()

            let {ethClient} = app
            let accountInfo = await dataProvider.accountProvider.getAccount({
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

            await ethClient.CoinContract.methods.balanceOf(accountInfo.cardNo).call(ethClient.adminInfo).then(balanceOf => {
                ctx.success({
                    accountId,
                    accountType: accountInfo.accountType,
                    balance: balanceOf
                })
            }).catch(err => {
                ctx.error(err)
            })
        }

        /**
         * 给账户初始化一笔feather
         * @returns {Promise<void>}
         */
        async officaialTap(ctx) {
            let accountId = ctx.checkQuery('accountId').match(accountHelper.verify, '账户格式错误').value
            ctx.validate()

            let {ethClient} = app
            let accountInfo = await dataProvider.accountProvider.getAccount({
                accountId, userId: ctx.request.userId
            })

            if (!accountInfo) {
                ctx.error({msg: `未找到用户账号${accountId}`})
            }
            if (accountInfo.accountType !== 1) {
                ctx.error({msg: `账户类型错误`})
            }

            let task = ethClient.OfficaialOpsContract.methods.tap(accountInfo.cardNo, 100000).send(ethClient.adminInfo)

            await new Promise((resolve, reject) => {
                task.on('transactionHash', resolve).catch(reject)
            }).then(hash => {
                ctx.success(hash)
            }).catch(error => {
                this.ctx.error(error)
            })
        }
    }
}