import {Provide, Scope, ScopeEnum} from "@midwayjs/decorator";
import * as Snowflake from '@axihe/snowflake';
import {pick, random} from 'lodash';
import {TransactionDetailInfo, TransactionRecordInfo} from "..";
import {hmacSha1, md5} from "egg-freelog-base/lib/crypto-helper";
import {v4} from 'uuid';
import {ApplicationError} from "egg-freelog-base";

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionHelper {

    /**
     * https://github.com/axihe/snowflake#readme
     */
    idWorker: Snowflake;

    constructor() {
        this.idWorker = new Snowflake(random(0, 10), random(0, 31));
    }

    /**
     * 生成雪花ID
     */
    generateSnowflakeId(): number {
        return this.idWorker.nextId();
    }

    /**
     * 生成加密盐值
     */
    generateSaltValue(): string {
        return (v4() + v4()).replace(/-/g, '');
    }

    /**
     * 交易记录签名
     * @param transactionRecordInfo
     */
    transactionRecordSignature(transactionRecordInfo: TransactionRecordInfo): string {

        const signFields = ['recordId', 'accountId', 'reciprocalAccountId', 'status', 'transactionAmount'];
        const signModel = pick(transactionRecordInfo, signFields);
        const signModelKeys = Object.keys(signModel).sort();

        if (signModelKeys.length !== signFields.length) {
            console.log(signModelKeys, signFields)
            throw new ApplicationError('交易记录信息不全,缺少加密用的必要字段')
        }

        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'record_sign_string')

        return transactionRecordInfo.signature = hmacSha1(md5(signString), transactionRecordInfo.saltValue);
    }

    /**
     * 校验交易记录信息是否正确
     * @param transactionRecordInfo
     */
    transactionRecordSignatureVerify(transactionRecordInfo: TransactionRecordInfo): boolean {
        const signature = transactionRecordInfo.signature;
        return signature === this.transactionRecordSignature(transactionRecordInfo);
    }

    /**
     * 交易明细签名
     * @param transactionDetailInfo
     */
    transactionDetailSignature(transactionDetailInfo: TransactionDetailInfo): string {

        const signFields = ['serialNo', 'transactionRecordId', 'accountId', 'reciprocalAccountId', 'status', 'transactionAmount', 'beforeBalance', 'afterBalance'];
        const signModel = pick(transactionDetailInfo, signFields);
        const signModelKeys = Object.keys(signModel).sort();

        if (signModelKeys.length !== signFields.length) {
            throw new Error('交易明细信息不全,缺少加密用的必要字段')
        }

        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'transaction_detail_sign_string')

        return transactionDetailInfo.signature = hmacSha1(md5(signString), transactionDetailInfo.saltValue);
    }

    /**
     * 校验交易明细签名信息是否正确
     * @param transactionDetailInfo
     */
    transactionDetailSignatureVerify(transactionDetailInfo: TransactionDetailInfo): boolean {
        const signature = transactionDetailInfo.signature;
        return signature === this.transactionDetailSignature(transactionDetailInfo);
    }
}
