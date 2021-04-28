import { IPipelineContext, IValveHandler } from '@midwayjs/core';
import { AccountHelper } from '../extend/account-helper';
import { TransactionHelper } from '../extend/transaction-helper';
export declare class TransactionPreconditionChecker implements IValveHandler {
    accountHelper: AccountHelper;
    transactionHelper: TransactionHelper;
    alias: string;
    /**
     * 账户状态,签名,交易额度等检查
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<boolean>;
    /**
     * 交易前置检查
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     */
    private transactionPreconditionCheck;
    /**
     * 合约支付确认前置检查
     * @param transactionRecord
     * @private
     */
    private contractPaymentConfirmedCheck;
    /**
     * 账户状态以及签名校验
     * @param accountInfo
     */
    private accountStatusAndSignatureCheck;
    /**
     * 交易金额检查
     * @param fromAccountInfo
     * @param transactionAmount
     */
    private transactionAmountCheck;
    /**
     * 交易记录签名校验
     * @param transactionRecord
     * @private
     */
    private transactionRecordSignatureVerify;
}
