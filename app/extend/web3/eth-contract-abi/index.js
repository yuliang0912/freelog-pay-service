'use strcit'

const fs = require('fs')

// module.exports = {
//
//     OfficaialOps: {
//         address: '0x1d171bb7d33d5c228be6bbaa7fa5cd6526f5fea8',
//         abi: JSON.parse(fs.readFileSync(__dirname + '/OfficialOps.abi', 'utf-8'))
//     },
//
//     Coin: {
//         address: '0x8b1442be7ff4a243d14d297c5a3b7813985ecf53',
//         abi: JSON.parse(fs.readFileSync(__dirname + '/Coin.abi', 'utf-8'))
//     },
//
//     account: {
//         admin: '0x3dc0ecb30b6e9b4ac792d89ed642097bdc1f1c52',
//         accountOne: '0x3dc0ecb30b6e9b4ac792d89ed642097bdc1f1c52',
//         accountTwo: '0x7447c1a3204581803fd7737bd1fb736c213345ee'
//     },
//
//     newManagingContractAddress: '0x8e84fa09bd55faa1eca14760877a89bce6af3bb1'
// }


//testrpc 环境
module.exports = {

    OfficaialOps: {
        address: '0x42d03f45ff1d8e09e3f7e5293239e32905088c92',
        abi: JSON.parse(fs.readFileSync(__dirname + '/OfficialOps.abi', 'utf-8'))
    },

    Coin: {
        address: '0x4f7a4e7a907dc50819b669485c05966892d5743e',
        abi: JSON.parse(fs.readFileSync(__dirname + '/Coin.abi', 'utf-8'))
    },

    account: {
        admin: '0xc381d03dc7b0727cd1d7d6a6d6272f105ba02147',
        accountOne: '0xc381d03dc7b0727cd1d7d6a6d6272f105ba02147',
        accountTwo: '0xe604616191a5e90fb4047cda5d6184349a48ab85'
    }
}