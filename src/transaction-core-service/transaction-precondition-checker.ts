import {IPipelineContext, IValveHandler} from '@midwayjs/core'
import {Inject, Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {AccountHelper} from '../extend/account-helper';
import {AccountInfo, TransactionHandleTypeEnum, TransactionRecordInfo, TransactionStatusEnum} from '..';
import {ApplicationError, LogicError} from 'egg-freelog-base';
import {Decimal} from 'decimal.js-light';
import {TransactionHelper} from '../extend/transaction-helper';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionPreconditionChecker implements IValveHandler {

    @Inject()
    accountHelper: AccountHelper;
    @Inject()
    transactionHelper: TransactionHelper;

    alias = 'transactionPreconditionChecker';

    /**
     * 账户状态,签名,交易额度等检查
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<boolean> {
        const {transactionHandleType, transactionRecord, fromAccount, toAccount, transactionAmount} = ctx.args;
        switch (transactionHandleType as TransactionHandleTypeEnum) {
            case TransactionHandleTypeEnum.ForthwithTransfer:
                return this.transactionPreconditionCheck(fromAccount, toAccount, transactionAmount);
            case TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                return this.transactionPreconditionCheck(fromAccount, toAccount, transactionAmount);
            case TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
            case TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
                return this.contractPaymentConfirmedCheck(transactionRecord);
            default:
                return Promise.reject('不支持的交易处理类型');
        }
    }

    /**
     * 交易前置检查
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     */
    private async transactionPreconditionCheck(fromAccount: AccountInfo, toAccount: AccountInfo, transactionAmount: number) {
        this.accountStatusAndSignatureCheck(fromAccount);
        this.accountStatusAndSignatureCheck(toAccount);
        if (fromAccount.accountId === toAccount.accountId) {
            throw new ApplicationError('发起方账户与收款方账户不能一致');
        }
        this.transactionAmountCheck(fromAccount, transactionAmount);
        return true;
    }

    /**
     * 合约支付确认前置检查
     * @param transactionRecord
     * @private
     */
    private async contractPaymentConfirmedCheck(transactionRecord: TransactionRecordInfo) {
        if (!transactionRecord) {
            throw new ApplicationError('交易记录数据缺失');
        }
        this.transactionRecordSignatureVerify(transactionRecord);
        if (transactionRecord.status !== TransactionStatusEnum.ToBeConfirmation) {
            throw new LogicError('交易已处理,不能重复提交');
        }
        return true;
    }

    /**
     * 账户状态以及签名校验
     * @param accountInfo
     */
    private accountStatusAndSignatureCheck(accountInfo: AccountInfo) {
        if (!accountInfo) {
            throw new ApplicationError('账户信息缺失');
        }
        if (accountInfo.status === 2) {
            throw new ApplicationError(`账户${accountInfo.accountId}已被冻结,无法执行交易`);
        } else if (accountInfo.status !== 1) {
            throw new ApplicationError(`账户${accountInfo.accountId}状态不正常,无法执行交易`);
        }
        const accountSignatureVerifyResult = this.accountHelper.accountSignatureVerify(accountInfo);
        if (!accountSignatureVerifyResult) {
            throw new ApplicationError('账户签名校验失败,完整性校验失败,无法执行交易');
        }
        return true;
    }

    /**
     * 交易金额检查
     * @param fromAccountInfo
     * @param transactionAmount
     */
    private transactionAmountCheck(fromAccountInfo: AccountInfo, transactionAmount: number) {
        if (transactionAmount <= 0) {
            throw new ApplicationError('交易金额不能小于0');
        }
        if (new Decimal(transactionAmount).gt(fromAccountInfo.balance)) {
            throw new ApplicationError('账户余额不足,无法执行交易');
        }
        if (new Decimal(transactionAmount).gt(new Decimal(fromAccountInfo.balance).minus(fromAccountInfo.freezeBalance).toNumber())) {
            throw new ApplicationError('账户可用余额不足(扣除冻结金额),无法执行交易');
        }
        return true;
    }

    /**
     * 交易记录签名校验
     * @param transactionRecord
     * @private
     */
    private transactionRecordSignatureVerify(transactionRecord: TransactionRecordInfo) {
        if (!this.transactionHelper.transactionRecordSignatureVerify(transactionRecord)) {
            throw new ApplicationError('交易操作记录签名校验失败,完整性校验失败,无法执行交易');
        }
        return true;
    }
}
