import { IPipelineContext, IValveHandler } from '@midwayjs/core';
import { TransactionDetailInfo } from '..';
import { TransactionHelper } from '../extend/transaction-helper';
export declare class TransactionDetailHandler implements IValveHandler {
    transactionHelper: TransactionHelper;
    alias: string;
    /**
     * 保存交易记录
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<TransactionDetailInfo[]>;
    /**
     * 合约支付确认成功处理
     * @param manager
     * @param toAccountInfo
     * @param transactionRecord
     * @private
     */
    private contractPaymentConfirmedSuccessfulHandle;
    /**
     * 合约支付确认取消处理
     * @param manager
     * @param transactionRecordInfo
     * @private
     */
    private contractPaymentConfirmedCancelHandle;
    /**
     * 保存待确认中的交易明细
     * @param manager
     * @param fromAccountInfo
     * @param transactionRecordInfo
     * @private
     */
    private createToBeConfirmationTransactionDetail;
    /**
     * 创建双向交易记录(交易完成时,入账和出账记录同时生成)
     * @param manager
     * @param fromAccountInfo
     * @param toAccountInfo
     * @param transactionRecordInfo
     * @private
     */
    private createBidirectionalTransactionDetail;
    /**
     * 保存交易记录数据
     * @param manager
     * @param transactionDetails
     * @private
     */
    private saveTransactionDetails;
}
