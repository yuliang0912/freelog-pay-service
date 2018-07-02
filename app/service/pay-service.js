'use strict'

const Service = require('egg').Service

module.exports = class PayController extends Service {

    /**
     * feather支付
     * @param model
     */
    async ethPay(model) {

        const {ctx, app} = this
        const {ethClient, dal} = app
        const {CoinContract, OfficaialOpsContract} = ethClient

        await CoinContract.methods.balanceOf(model.sendAccountInfo.cardNo).call(ethClient.adminInfo).then(balanceOf => {
            if (balanceOf < model.amount) {
                ctx.error({msg: `账户${model.sendAccountInfo.accountId}余额不足,无法支付`})
            }
        })

        const transferArgs = {
            fromAddress: model.sendAccountInfo.cardNo,
            toAddress: model.receiveAccountInfo.cardNo,
            value: model.amount,
            data: ethClient.web3.utils.asciiToHex(`contract:${model.targetId}`)
        }

        model.status = 1

        const sendToEth = OfficaialOpsContract.methods.officialTransfer(
            transferArgs.fromAddress,
            transferArgs.toAddress,
            transferArgs.value,
            transferArgs.data
        ).send(ethClient.adminInfo)

        model.transferId = await new Promise(function (resolve, reject) {
            sendToEth.on('transactionHash', resolve).catch(reject)
        }).catch(ctx.error)

        return dal.payOrderProvider.createPayOrder(model)
    }
}