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
        address: '0xc5610e964ec5ed2f74e3794e2a2d7fff41e05725',
        abi: JSON.parse(fs.readFileSync(__dirname + '/OfficialOps.abi', 'utf-8'))
    },

    Coin: {
        address: '0x8aca7fe1c177746eda9c7621efc569727f575951',
        abi: JSON.parse(fs.readFileSync(__dirname + '/Coin.abi', 'utf-8'))
    },

    account: {
        admin: '0x60ba16051dc751af2816c3f0b7f56f88bcac1bc2',
        accountOne: '0x60ba16051dc751af2816c3f0b7f56f88bcac1bc2',
        accountTwo: '0xa09af67765d4ba7797209e64fdc3a71c9c33aff3'
    }
}