'use strict'


module.exports = app => {

    const dataProvider = app.dataProvider

    return class PayController extends app.Service {

        /**
         * feather支付
         * @param model
         */
        async ethPay(model) {

            let {ethClient} = app
            let {CoinContract, OfficaialOpsContract} = ethClient

            await CoinContract.methods.balanceOf(model.sendAccountInfo.cardNo).call(ethClient.adminInfo).then(balanceOf => {
                if (balanceOf < model.amount) {
                    this.ctx.error({msg: `账户${model.sendAccountInfo.accountId}余额不足,无法支付`})
                }
            })

            let transferArgs = {
                fromAddress: model.sendAccountInfo.cardNo,
                toAddress: model.receiveAccountInfo.cardNo,
                value: model.amount,
                data: ethClient.web3.utils.asciiToHex(`contract:${model.targetId}`)
            }

            model.status = 1

            let sendToEth = OfficaialOpsContract.methods.officialTransfer(
                transferArgs.fromAddress,
                transferArgs.toAddress,
                transferArgs.value,
                transferArgs.data
            ).send(ethClient.adminInfo)

            model.transferId = await new Promise(function (resolve, reject) {
                sendToEth.on('transactionHash', resolve).catch(reject)
            }).catch(error => this.ctx.error(error))

            return dataProvider.payOrderProvider.createPayOrder(model)
        }
    }
}