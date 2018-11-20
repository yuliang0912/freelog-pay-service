'use strcit'

const fs = require('fs')

// module.exports = {
//
//     OfficialOps: {
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

    OfficialOps: {
        address: '0xe3241568d73b3750b3e9a079e56c538c85457186',
        abi: JSON.parse(fs.readFileSync(__dirname + '/OfficialOps.abi', 'utf-8'))
    },

    Coin: {
        address: '0x61c03c84de46a6bd6cb63c1b63690a04f69a5986',
        abi: JSON.parse(fs.readFileSync(__dirname + '/Coin.abi', 'utf-8'))
    },

    account: {
        admin: '0xff56bfc2f267ac81ed70213db0839c3daea273f6',
        freelog: '0xff56bfc2f267ac81ed70213db0839c3daea273f6'
    }
}