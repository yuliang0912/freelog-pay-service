'use strict'


module.exports = async app => {

    let {ethClient} = app
    let {CoinContract, OfficaialOpsContract, ethContractInfo} = ethClient


    await CoinContract.methods.symbol().call(ethClient.adminInfo).then(data => {
        console.log(`CoinContract-symbol:${data}`)
    })


    // await OfficaialOpsContract.methods.setCoinAddress(ethContractInfo.Coin.address).send({from: ethContractInfo.account.accountOne}).on('transactionHash', console.log).then(receipt => {
    //     console.log(receipt)
    // }).catch(() => {
    //     console.log(111)
    // })


    // await OfficaialOpsContract.methods.setCoinAddress(ethContractInfo.Coin.address).send({from: ethContractInfo.account.accountOne}).on('transactionHash', function (hash) {
    //     console.log('transactionHash:' + hash)
    // }).on('receipt', function (receipt) {
    //     console.log('receipt', receipt)
    // }).on('error', console.error)

    // await OfficaialOpsContract.methods.mintToken(2000000000).send({from: ethContractInfo.account.accountOne}).then(data => {
    //     CoinContract.methods.totalSupply().call({from: ethContractInfo.account.accountOne}).then(data => {
    //         console.log(`CoinContract-totalSupply:${data}`)
    //     })
    // })

    return
    //
    // OfficaialOpsContract.methods.tap('0xf67c8c6f35d42ce7660a89ecee7d909497c3ff06', 10000000).send({from: ethContractInfo.account.accountOne}).then(() => {
    //     CoinContract.methods.balanceOf('0xf67c8c6f35d42ce7660a89ecee7d909497c3ff06').call({from: ethContractInfo.account.accountOne}).then(console.log)
    // })
    //

    console.log(CoinContract.methods)

    // CoinContract.methods.transfer('0x31db9923f2805018f271ad7c37bdea5095dd1ed2', 1, '').send({from: '0xf67c8c6f35d42ce7660a89ecee7d909497c3ff06'}).then(() => {
    //     CoinContract.methods.balanceOf('0xf67c8c6f35d42ce7660a89ecee7d909497c3ff06').call({from: ethContractInfo.account.accountOne}).then(console.log)
    //     CoinContract.methods.balanceOf('0x31db9923f2805018f271ad7c37bdea5095dd1ed2').call({from: ethContractInfo.account.accountOne}).then(console.log)
    // })


    // OfficaialOpsContract.methods.tap('0x87d806cb9ae5beeedf78ac10efac1a55e438bc2d',100000).send({from: ethContractInfo.account.accountOne}).then(() => {
    //     CoinContract.methods.balanceOf('0x87d806cb9ae5beeedf78ac10efac1a55e438bc2d').call({from: ethContractInfo.account.accountOne}).then(console.log)
    // })

    //OfficaialOpsContract.methods.tapRecord('0xf67c8c6f35d42ce7660a89ecee7d909497c3ff06').call({from: ethContractInfo.account.accountOne}).then(console.log)

    //CoinContract.methods.balanceOf('0x31db9923f2805018f271ad7c37bdea5095dd1ed2').call({from: ethContractInfo.account.accountOne}).then(console.log)

    // await OfficaialOpsContract.methods.officialSetPrice(2000000000000).send({from: ethContractInfo.account.accountOne}).then(()=>{
    //     CoinContract.methods.price().call({from: ethContractInfo.account.accountOne}).then(console.log)
    // })
    //
    // await CoinContract.methods.buyFixedFeather(5).send({
    //     from: ethContractInfo.account.accountOne,
    //     value: 10000000000000
    // }).then(() => {
    //     CoinContract.methods.balanceOf(ethContractInfo.account.accountOne).call({from: ethContractInfo.account.accountOne}).then(console.log)
    // })

    //await OfficaialOpsContract.methods.officialWithdrawals(ethContractInfo.account.accountTwo, 10000000000000).send({from: ethContractInfo.account.accountOne});

    return;

    //
    //
    // //获取总发行货币数
    // CoinContract.methods.totalSupply().call({from: ethContractInfo.account.accountOne}).then(data => {
    //     console.log(`CoinContract-totalSupply:${data}`)
    // })
    //

    // CoinContract.methods.buyFeather().send({
    //     from: ethContractInfo.account.accountOne,
    //     value: 10000000000000
    // }).then(() => {
    //     CoinContract.methods.balanceOf(ethContractInfo.account.accountOne).call({from: ethContractInfo.account.accountOne}).then(console.log)
    // })

    //CoinContract.methods.surplusEther(ethContractInfo.account.accountOne).call({from: ethContractInfo.account.accountOne}).then(console.log)

    //return

    //CoinContract.methods.withdrawals().send({from: ethContractInfo.account.accountOne}).then(console.log)

    // await OfficaialOpsContract.methods.setCoinAddress(ethContractInfo.Coin.address).send({from: ethContractInfo.account.accountOne}).then(data => {
    //     OfficaialOpsContract.methods.coinAddress().call({from: ethContractInfo.account.accountOne}).then(data => {
    //         console.log(`OfficaialOpsContract-coinAddress:${data}`)
    //     })
    // })
    //
    // CoinContract.methods.managingContract().call({from: ethContractInfo.account.accountOne}).then(data => {
    //     console.log(`OfficaialOpsContract-coinAddress:${data}`)
    // })
    //
    // //增发2000000个货币(OK)
    // await OfficaialOpsContract.methods.mintToken(2000000, 'feather').send({from: ethContractInfo.account.accountOne}).then(data => {
    //     CoinContract.methods.totalSupply().call({from: ethContractInfo.account.accountOne}).then(data => {
    //         console.log(`CoinContract-totalSupply:${data}`)
    //     })
    // })


    return;

    //
    // CoinContract.methods.totalSupply().call({from: ethContractInfo.account.accountOne}).then(data => {
    //     console.log(`CoinContract-managingContract:${data}`)
    // })


    //获取官方管理合同超管账号
    OfficaialOpsContract.methods.admin().call({from: ethContractInfo.account.accountOne}).then(data => {
        console.log(`OfficaialOpsContract-admin:${data}`)
    })

    //获取被管理的货币合同地址
    OfficaialOpsContract.methods.coinAddress().call({from: ethContractInfo.account.accountOne}).then(data => {
        console.log(`OfficaialOpsContract-coinAddress:${data}`)
    })


    //管理合同设置被管理的货币合同地址
    OfficaialOpsContract.methods.setCoinAddress(ethContractInfo.Coin.address).send({from: accountOne}).then(data => {
        OfficaialOpsContract.methods.coinAddress().call({from: accountOne}).then(data => {
            console.log(`OfficaialOpsContract-coinAddress:${data}`)
        })
    })
}


