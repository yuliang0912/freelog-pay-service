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
        address: '0xe6c957df91acd351d9d1779f1ac62648b9f7857b',
        abi: JSON.parse(fs.readFileSync(__dirname + '/OfficialOps.abi', 'utf-8'))
    },

    Coin: {
        address: '0x18087d2606a8c2a676572185d01f17227925da1d',
        abi: JSON.parse(fs.readFileSync(__dirname + '/Coin.abi', 'utf-8'))
    },

    account: {
        admin: '0xd98d69194cf6d1852e70f3509bfb563076849e0c',
        accountOne: '0xd98d69194cf6d1852e70f3509bfb563076849e0c',
        accountTwo: '0xc5463ad0824cefbc77d82e389ffc5ac4b34a5daf'
    }
}