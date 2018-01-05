'use strict'


const uuid = require('node-uuid')
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')

module.exports = {

    /**
     * 生成加密密码
     * @param userId
     * @param password
     * @returns {*}
     */
    generatePassword(userId, password) {

        if (!password || password.length < 6) {
            throw new Error('密码必须是最少6位长度的字符')
        }

        let salt = uuid.v4().replace(/-/g, '')

        return {
            salt,
            password: crypto.hmacSha1(`transcation-password-${userId}-${password}`, salt)
        }
    },


    /**
     * 校验密码
     * @param userId  用户ID
     * @param salt  盐值
     * @param password 加密之后的密码
     * @param originalPassword  未加密的原始密码
     * @returns {boolean}
     */
    verifyPassword({userId, salt, password, originalPassword}) {
        //console.log(crypto.hmacSha1(`transcation-password-${userId}-${originalPassword}`, salt))
        return crypto.hmacSha1(`transcation-password-${userId}-${originalPassword}`, salt) === password
    }
}