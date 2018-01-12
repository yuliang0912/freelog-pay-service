/**
 * Created by yuliang on 2017/9/11.
 */

'use strict';

const fs = require('fs')
const path = require('path')

module.exports = app => {
    fs.readdirSync(path.join(__dirname, './router')).forEach(router => {
        require(path.join(__dirname, './router', router))(app)
    })
}