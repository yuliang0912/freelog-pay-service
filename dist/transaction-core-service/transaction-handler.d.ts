import { IValveHandler, IPipelineContext } from '@midwayjs/core';
import { AccountHelper } from '../extend/account-helper';
export declare class TransactionHandler implements IValveHandler {
    accountHelper: AccountHelper;
    alias: string;
    /**
     * 交易扣款,余额与签名等数据修改
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<any>;
    /**
     * 即时转账
     * @param manager
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @private
     */
    private forthwithTransferHandle;
    /**
     * 待确认的合约支付
     * @param manager
     * @param fromAccount
     * @param transactionAmount
     * @private
     */
    private toBeConfirmedPaymentHandler;
    /**
     * 合约支付确认成功
     * @param manager
     * @param transactionRecord
     * @private
     */
    private contractPaymentConfirmedSuccessful;
    /**
     * 合约支付确认取消
     * @param manager
     * @param transactionRecord
     * @private
     */
    private contractPaymentConfirmedCancel;
    /**
     * 执行交易操作
     * @param manager
     * @param accountInfo
     * @param transactionAmount
     * @private
     */
    private transaction;
}
