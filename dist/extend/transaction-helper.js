"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHelper = void 0;
const decorator_1 = require("@midwayjs/decorator");
const Snowflake = require("@axihe/snowflake");
const lodash_1 = require("lodash");
const crypto_helper_1 = require("egg-freelog-base/lib/crypto-helper");
const uuid_1 = require("uuid");
const egg_freelog_base_1 = require("egg-freelog-base");
let TransactionHelper = class TransactionHelper {
    constructor() {
        this.idWorker = new Snowflake(lodash_1.random(0, 10), lodash_1.random(0, 31));
    }
    /**
     * 生成雪花ID
     */
    generateSnowflakeId() {
        return this.idWorker.nextId();
    }
    /**
     * 生成加密盐值
     */
    generateSaltValue() {
        return (uuid_1.v4() + uuid_1.v4()).replace(/-/g, '');
    }
    /**
     * 生成签名文本
     * @param signatureData
     * @param keyValueSeparator
     * @param keySeparator
     */
    generateSignatureText(signatureData, keyValueSeparator = '=', keySeparator = '_') {
        if (!lodash_1.isObject(signatureData) || lodash_1.isEqual(signatureData, {})) {
            throw new egg_freelog_base_1.ArgumentError('参数signatureData不是一个有效对象');
        }
        return Object.keys(signatureData).sort().map(key => `${key}${keyValueSeparator}${signatureData[key]}`).join(keySeparator);
    }
    /**
     * 交易记录签名
     * @param transactionRecordInfo
     */
    transactionRecordSignature(transactionRecordInfo) {
        const signFields = ['recordId', 'accountId', 'reciprocalAccountId', 'status', 'transactionAmount'];
        const signModel = lodash_1.pick(transactionRecordInfo, signFields);
        const signModelKeys = Object.keys(signModel).sort();
        if (signModelKeys.length !== signFields.length) {
            throw new egg_freelog_base_1.ApplicationError('交易记录信息不全,缺少加密用的必要字段');
        }
        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'record_sign_string');
        return transactionRecordInfo.signature = crypto_helper_1.hmacSha1(crypto_helper_1.md5(signString), transactionRecordInfo.saltValue);
    }
    /**
     * 校验交易记录信息是否正确
     * @param transactionRecordInfo
     */
    transactionRecordSignatureVerify(transactionRecordInfo) {
        const signature = transactionRecordInfo.signature;
        return signature === this.transactionRecordSignature(transactionRecordInfo);
    }
    /**
     * 交易明细签名
     * @param transactionDetailInfo
     */
    transactionDetailSignature(transactionDetailInfo) {
        const signFields = ['serialNo', 'transactionRecordId', 'accountId', 'reciprocalAccountId', 'status', 'transactionAmount', 'beforeBalance', 'afterBalance'];
        const signModel = lodash_1.pick(transactionDetailInfo, signFields);
        const signModelKeys = Object.keys(signModel).sort();
        if (signModelKeys.length !== signFields.length) {
            throw new Error('交易明细信息不全,缺少加密用的必要字段');
        }
        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'transaction_detail_sign_string');
        return transactionDetailInfo.signature = crypto_helper_1.hmacSha1(crypto_helper_1.md5(signString), transactionDetailInfo.saltValue);
    }
    /**
     * 校验交易明细签名信息是否正确
     * @param transactionDetailInfo
     */
    transactionDetailSignatureVerify(transactionDetailInfo) {
        const signature = transactionDetailInfo.signature;
        return signature === this.transactionDetailSignature(transactionDetailInfo);
    }
};
TransactionHelper = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton),
    __metadata("design:paramtypes", [])
], TransactionHelper);
exports.TransactionHelper = TransactionHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24taGVscGVyLmpzIiwic291cmNlUm9vdCI6IkQ6L+W3peS9nC9mcmVlbG9nLXBheS1zZXJ2aWNlL3NyYy8iLCJzb3VyY2VzIjpbImV4dGVuZC90cmFuc2FjdGlvbi1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQThEO0FBQzlELDhDQUE4QztBQUM5QyxtQ0FBdUQ7QUFFdkQsc0VBQWlFO0FBQ2pFLCtCQUF3QjtBQUN4Qix1REFBaUU7QUFJakUsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7SUFPMUI7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLGVBQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsZUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7T0FFRztJQUNILG1CQUFtQjtRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQkFBaUI7UUFDYixPQUFPLENBQUMsU0FBRSxFQUFFLEdBQUcsU0FBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILHFCQUFxQixDQUFDLGFBQXFCLEVBQUUsaUJBQWlCLEdBQUcsR0FBRyxFQUFFLFlBQVksR0FBRyxHQUFHO1FBQ3BGLElBQUksQ0FBQyxpQkFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGdCQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3hELE1BQU0sSUFBSSxnQ0FBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDdEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FB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