import { IPipelineContext, IValveHandler } from '@midwayjs/core';
import { TransactionRecordInfo } from '..';
import { TransactionHelper } from '../extend/transaction-helper';
export declare class TransactionRecordHandler implements IValveHandler {
    transactionHelper: TransactionHelper;
    alias: string;
    /**
     * 保存交易记录
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<TransactionRecordInfo>;
    /**
     * 创建交易记录
     * @param manager
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @param transactionType
     * @param transactionAuthorizationResult
     * @param transactionStatus
     * @param remark
     * @param attachInfo
     * @private
     */
    private createTransactionRecord;
    /**
     * 修改交易记录
     * @param manager
     * @param transactionRecord
     * @param transactionStatus
     * @private
     */
    private updateTransactionRecord;
}
