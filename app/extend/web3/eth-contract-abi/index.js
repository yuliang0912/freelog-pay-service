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
        address: '0x8ef76ef5ceead1bb8b00426f8bd758ae3975dc80',
        abi: JSON.parse(fs.readFileSync(__dirname + '/OfficialOps.abi', 'utf-8'))
    },

    Coin: {
        address: '0x71d0ce09c28da4fa5906baa9a1d0d4ede4d72e51',
        abi: JSON.parse(fs.readFileSync(__dirname + '/Coin.abi', 'utf-8'))
    },

    account: {
        admin: '0xc43e51cbc39722c77433d92c69c17e2a85a0641a',
        accountOne: '0xc43e51cbc39722c77433d92c69c17e2a85a0641a',
        accountTwo: '0x1b9cba6b5b634d0e47cb60ac6cb6616eec80098f'
    }
}