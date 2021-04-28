import * as Snowflake from '@axihe/snowflake';
import { TransactionDetailInfo, TransactionRecordInfo } from "..";
export declare class TransactionHelper {
    /**
     * https://github.com/axihe/snowflake#readme
     */
    idWorker: Snowflake;
    constructor();
    /**
     * 生成雪花ID
     */
    generateSnowflakeId(): number;
    /**
     * 生成加密盐值
     */
    generateSaltValue(): string;
    /**
     * 交易记录签名
     * @param transactionRecordInfo
     */
    transactionRecordSignature(transactionRecordInfo: TransactionRecordInfo): string;
    /**
     * 校验交易记录信息是否正确
     * @param transactionRecordInfo
     */
    transactionRecordSignatureVerify(transactionRecordInfo: TransactionRecordInfo): boolean;
    /**
     * 交易明细签名
     * @param transactionDetailInfo
     */
    transactionDetailSignature(transactionDetailInfo: TransactionDetailInfo): string;
    /**
     * 校验交易明细签名信息是否正确
     * @param transactionDetailInfo
     */
    transactionDetailSignatureVerify(transactionDetailInfo: TransactionDetailInfo): boolean;
}
