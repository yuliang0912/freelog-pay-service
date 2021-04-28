import {IValveHandler, IPipelineContext} from '@midwayjs/core'
import {Inject, Provide, Scope, ScopeEnum} from "@midwayjs/decorator";
import {AccountInfo, TransactionHandleTypeEnum, TransactionRecordInfo, TransactionStatusEnum} from "..";
import {EntityManager} from 'typeorm';
import {AccountHelper} from '../extend/account-helper';
import Decimal from 'decimal.js-light';
import {ApplicationError, LogicError} from 'egg-freelog-base';
import {cloneDeep} from 'lodash';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionHandler implements IValveHandler {

    @Inject()
    accountHelper: AccountHelper;

    // 交易处理.此任务只负责账号信息维护
    alias = 'transactionHandler';

    /**
     * 交易扣款,余额与签名等数据修改
     * @param ctx
     */
    async invoke(ctx: IPipelineContext): Promise<any> {
        const {manager, transactionHandleType, transactionRecord, fromAccount, toAccount, transactionAmount} = ctx.args;
        switch (transactionHandleType as TransactionHandleTypeEnum) {
            case TransactionHandleTypeEnum.ForthwithTransfer:
                return this.forthwithTransferHandle(manager, fromAccount, toAccount, transactionAmount);
            case TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                return this.toBeConfirmedPaymentHandler(manager, fromAccount, transactionAmount);
            case TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
                return this.contractPaymentConfirmedSuccessful(manager, transactionRecord);
            case TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
                return this.contractPaymentConfirmedCancel(manager, transactionRecord);
            default:
                return Promise.reject('不支持的交易处理类型');
        }
    }

    /**
     * 即时转账
     * @param manager
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @private
     */
    private async forthwithTransferHandle(manager: EntityManager, fromAccount: AccountInfo, toAccount: AccountInfo, transactionAmount: number) {

        const task1 = this.transaction(manager, fromAccount, -transactionAmount);
        const task2 = this.transaction(manager, toAccount, transactionAmount);

        const isTransactionSuccessful = await Promise.all([task1, task2]).then(list => list.every(x => x));
        if (!isTransactionSuccessful) {
            throw new ApplicationError('交易失败,请稍后再试');
        }
        return true;
    }

    /**
     * 待确认的合约支付
     * @param manager
     * @param fromAccount
     * @param transactionAmount
     * @private
     */
    private async toBeConfirmedPaymentHandler(manager: EntityManager, fromAccount: AccountInfo, transactionAmount: number): Promise<boolean> {
        return this.transaction(manager, fromAccount, -transactionAmount);
    }

    /**
     * 合约支付确认成功
     * @param manager
     * @param transactionRecord
     * @private
     */
    private async contractPaymentConfirmedSuccessful(manager: EntityManager, transactionRecord: TransactionRecordInfo) {
        if (transactionRecord.status !== TransactionStatusEnum.ToBeConfirmation) {
            throw new LogicError('交易已被处理,无法重复处理')
        }
        const reciprocalAccountInfo = await manager.findOne(AccountInfo, transactionRecord.reciprocalAccountId);
        return this.transaction(manager, reciprocalAccountInfo, -transactionRecord.transactionAmount);
    }

    /**
     * 合约支付确认取消
     * @param manager
     * @param transactionRecord
     * @private
     */
    private async contractPaymentConfirmedCancel(manager: EntityManager, transactionRecord: TransactionRecordInfo) {
        if (transactionRecord.status !== TransactionStatusEnum.ToBeConfirmation) {
            throw new LogicError('交易已被处理,无法重复处理')
        }
        const accountInfo = await manager.findOne(AccountInfo, transactionRecord.accountId);
        return this.transaction(manager, accountInfo, -transactionRecord.transactionAmount);
    }

    /**
     * 执行交易操作
     * @param manager
     * @param accountInfo
     * @param transactionAmount
     * @private
     */
    private async transaction(manager: EntityManager, accountInfo: AccountInfo, transactionAmount): Promise<boolean> {

        // 此处深拷贝,是由于此函数需要改变对象的属性值,但是又不能影响到其他处理函数.
        accountInfo = cloneDeep(accountInfo);

        const oldSignature = accountInfo.signature;
        accountInfo.balance = new Decimal(accountInfo.balance).add(transactionAmount).toFixed(2);
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);

        return manager.update(AccountInfo, {
            accountId: accountInfo.accountId, signature: oldSignature
        }, {
            balance: accountInfo.balance,
            signature: accountInfo.signature
        }).then(x => Boolean(x.affected));
    }
}
