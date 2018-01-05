// /**
//  * Created by yuliang on 2017/11/28.
//  */
//
// 'use strict'
//
// const Web3 = require('web3');
// const net = require('net');
// const web3 = new Web3('/home/yuliang/.ethereum/geth.ipc', net);
// const ethContractInfo = require('../../eth-contract-abi/index')
//
//
// module.exports = async app => {
//
//     return
//
//     let CoinContract = new web3.eth.Contract(ethContractInfo.Coin.abi, ethContractInfo.Coin.address);
//     let OfficaialOpsContract = new web3.eth.Contract(ethContractInfo.OfficaialOps.abi, ethContractInfo.OfficaialOps.address);
//
//     console.log(Web3.utils.hexToUtf8("0x6d696e74"))
//
//     console.log(web3.utils.utf8ToHex("mint"))
//     //检查是否是地址
//     console.log(web3.utils.isAddress('0xe041340b3338e1f220c10e9971aa4edf9bfd776e'))
//
//     //
//     // CoinContract.getPastEvents('Transfer', {
//     //     fromBlock: 125827,
//     //     toBlock: 'latest'
//     // }).then((events) => {
//     //     console.log(events);
//     // });
//
//
//
//     //获取总发行货币数(OK)
//     CoinContract.methods.totalSupply().call({from: '0xF2CD2AA0c7926743B1D4310b2BC984a0a453c3d4'}).then(data => {
//         console.log(`CoinContract-totalSupply:${data}`)
//     })
//
//
//
//     //获取货币管理合同地址(OK)
//     // CoinContract.methods.managingContract().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //     console.log(`CoinContract-managingContract:${data}`)
//     // })
//     //
//     //获取官方管理合同超管账号(OK)
//     // OfficaialOpsContract.methods.admin().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //     console.log(`OfficaialOpsContract-admin:${data}`)
//     // })
//     //
//     // //获取被管理的货币合同地址(OK)
//     // OfficaialOpsContract.methods.coinAddress().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //     console.log(`OfficaialOpsContract-coinAddress:${data}`)
//     // })
//     //
//
//     //管理合同设置被管理的货币合同地址(OK)
//     // await OfficaialOpsContract.methods.setCoinAddress(ethContractInfo.Coin.address).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     OfficaialOpsContract.methods.coinAddress().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`OfficaialOpsContract-coinAddress:${data}`)
//     //     })
//     // })
//
//
//     // //超管指定管理员(OK)
//     // OfficaialOpsContract.methods.hire_manager(ethContractInfo.account.accountTwo).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     OfficaialOpsContract.methods.isManager(ethContractInfo.account.accountTwo).call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`OfficaialOpsContract-admin:${data}`)
//     //     })
//     // })
//
//
//     // //超管指定继承人(OK)
//     // OfficaialOpsContract.methods.demise(ethContractInfo.account.accountTwo).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     OfficaialOpsContract.methods.heir().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`OfficaialOpsContract-heir:${data}`)
//     //     })
//     // })
//
//
//     ////继承人确认继位(OK)
//     // OfficaialOpsContract.methods.succeedAdmin().send({from: ethContractInfo.account.accountTwo}).then(data => {
//     //     OfficaialOpsContract.methods.admin().call({from: ethContractInfo.account.accountTwo}).then(data => {
//     //         console.log(`OfficaialOpsContract-admin:${data}`)
//     //     })
//     // })
//
//     //管理合同变更新的管理合同地址
//     // await OfficaialOpsContract.methods.officialChangeManagingContract(ethContractInfo.newManagingContractAddress).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     OfficaialOpsContract.methods.heirManagingContract().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`OfficaialOpsContract-heirManagingContract:${data}`)
//     //     })
//     // })
//
//
//     //创建新的管理合同对象
//     //let newOfficaialOpsContract = new web3.eth.Contract(ethContractInfo.OfficaialOps.abi, ethContractInfo.newManagingContractAddress);
//
//     // await newOfficaialOpsContract.methods.officialFreezeAccount(ethContractInfo.account.accountTwo, false)
//     //     .send({from: ethContractInfo.account.accountOne})
//
//     //await CoinContract.methods.frozenAccount(ethContractInfo.account.accountTwo).call({from: ethContractInfo.account.accountOne}).then(console.log)
//
//     //CoinContract.methods.balanceOf(ethContractInfo.account.accountTwo).call({from: ethContractInfo.account.accountOne}).then(console.log)
//
//     // CoinContract.methods.transfer(ethContractInfo.account.accountTwo, 111).send({from: ethContractInfo.account.accountOne}).then(() => {
//     //     CoinContract.methods.balanceOf(ethContractInfo.account.accountTwo).call({from: ethContractInfo.account.accountOne}).then(console.log)
//     // })
//
//     // CoinContract.methods.burn(804).send({from: ethContractInfo.account.accountOne}).then(() => {
//     //     CoinContract.methods.balanceOf(ethContractInfo.account.accountOne).call({from: ethContractInfo.account.accountOne}).then(console.log)
//     // })
//
//
//     // await newOfficaialOpsContract.methods.tap(ethContractInfo.account.accountTwo, 230).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     CoinContract.methods.balanceOf(ethContractInfo.account.accountTwo).call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`CoinContract-balanceOf:${data}`)
//     //     })
//     // })
//
//     // newOfficaialOpsContract.methods.confrimSucceed(ethContractInfo.OfficaialOps.address).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     CoinContract.methods.managingContract().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`CoinContract-managingContract:${data}`)
//     //     })
//     // })
//
//
//     // newOfficaialOpsContract.methods.coinAddress().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //     console.log(`newOfficaialOpsContract-coinAddress:${data}`)
//     // })
//
//     // CoinContract.methods.heirManagingContract().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //     console.log(`CoinContract-heirManagingContract:${data}`)
//     // })
//
//
//     // newOfficaialOpsContract.methods.officialSucceed().send({from: ethContractInfo.account.accountOne}).then((d1) => {
//     //     console.log(d1)
//     //     // CoinContract.methods.managingContract().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //     //     console.log(`CoinContract-managingContract:${data}`)
//     //     // })
//     // })
//
//
//     //CoinContract.events.allEvents('Transfer')
//     //CoinContract.getPastEvents('Transfer', {fromBlock: 0, toBlock: 'latest'}).then(console.log);
//
//
//     //增发2000000个货币(OK)
//     // await OfficaialOpsContract.methods.mintToken(2000000000).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     CoinContract.methods.totalSupply().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`CoinContract-totalSupply:${data}`)
//     //     })
//     // })
//
//
//     //给账户初始化金额
//     // OfficaialOpsContract.methods.tap(ethContractInfo.account.accountOne,5000).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     CoinContract.methods.balanceOf(ethContractInfo.account.accountOne).call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`CoinContract-balanceOf:${data}`)
//     //     })
//     // })
//
//
//     // CoinContract.methods.balanceOf(ethContractInfo.newManagingContractAddress).call({from: ethContractInfo.account.accountOne}).then(data => {
//     //     console.log(`CoinContract-balanceOf:${data}`)
//     // })
//
//
//     // await newOfficaialOpsContract.methods.setCoinAddress(ethContractInfo.Coin.address).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     newOfficaialOpsContract.methods.coinAddress().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`newOfficaialOpsContract-coinAddress:${data}`)
//     //     })
//     // })
//     //
//     // await newOfficaialOpsContract.methods.mintToken(380).send({from: ethContractInfo.account.accountOne}).then(data => {
//     //     CoinContract.methods.totalSupply().call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`CoinContract-totalSupply:${data}`)
//     //     })
//     // })
//
//
//     //新超管取消旧超管的管理权限(OK)
//     // OfficaialOpsContract.methods.fire_manager(ethContractInfo.account.accountOne).send({from: ethContractInfo.account.accountTwo}).then(data => {
//     //     OfficaialOpsContract.methods.isManager(ethContractInfo.account.accountOne).call({from: ethContractInfo.account.accountOne}).then(data => {
//     //         console.log(`OfficaialOpsContract-isManager:${data}`)
//     //     })
//     // })
//
//
//     // web3.eth.getBalance(accountOne).then(data => {
//     //     console.log(`accountOne(${accountOne}):${data}`)
//     // })
//
//
//     //contract.methods.officialTransfer(accountOne, accountTwo, 100000).send({from: accountOne}).then(console.log)
//
//     //contract.methods.coinAddress().call({from: accountOne}).then(console.log)
//
//     //console.log(contract.methods)
//     //contract.methods.setCoinAddress('0xfdbedb44bdf81491f82ac0ff4c873e21e077818d').send({from:accountOne}).then(console.log)
//     //contract.methods.coinAddress().call({from: accountOne}).then(console.log)
//
//
//     // web3.eth.getBalance(accountOne).then(data=>{
//     //     console.log(`accountOne(${accountOne}):${data}`)
//     // })
//     //
//     // web3.eth.getBalance(accountTwo).then(data=>{
//     //     console.log(`accountWTwo(${accountTwo}):${data}`)
//     // })
//
//
//     // await contract.methods.setBalanceOf(10000).send({from: accountOne}).then(t => {
//     //     console.log('ttt:', t)
//     // }).catch(console.log)
//
//     // await contract.methods.getBalanceOf(accountOne).call({from: accountOne}).then(function (result) {
//     //     console.log('balance:', result);
//     // });
//
//     //contract.methods.transfer(accountTwo,0x100).call({from: accountOne}).then(console.log).catch(console.log)
//
//     // contract.events.Transfer((err, event) => {
//     //     console.log(err)
//     // })
//
//
// }
//
