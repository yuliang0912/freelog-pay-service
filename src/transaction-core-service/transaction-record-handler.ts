import {IPipelineContext, IValveHandler} from '@midwayjs/core';
import {Inject, Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {EntityManager} from 'typeorm';
import {
    AccountInfo, TransactionAuthorizationResult,
    TransactionHandleTypeEnum, TransactionRecordInfo,
    TransactionStatusEnum, TransactionTypeEnum
} from '..';
import {TransactionHelper} from '../extend/transaction-helper';
import {cloneDeep} from 'lodash';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionRecordHandler implements IValveHandler {

    @Inject()
    transactionHelper: TransactionHelper;

    // 交易记录处理
    alias = 'transactionRecordHandler';

    /**
     * 保存交易记录
     * @param ctx
     */
    async invoke(ctx: IPipelineContext): Promise<TransactionRecordInfo> {

        const {manager, transactionRecord, toAccount, fromAccount, transactionAmount, transactionAuthorizationResult, transactionHandleType, remark, attachInfo} = ctx.args;
        switch (transactionHandleType as TransactionHandleTypeEnum) {
            case TransactionHandleTypeEnum.ForthwithTransfer:
                return this.createTransactionRecord(manager, fromAccount, toAccount, transactionAmount, TransactionTypeEnum.Transfer, transactionAuthorizationResult, TransactionStatusEnum.Completed, remark, '转账', attachInfo);
            case TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                const subjectTypeName = attachInfo.subjectType === 1 ? '资源' : attachInfo.subjectType === 2 ? '展品' : attachInfo.subjectType === 3 ? '用户组' : '其他';
                const digest = `${subjectTypeName}-${attachInfo.contractName}`;
                return this.createTransactionRecord(manager, fromAccount, toAccount, transactionAmount, TransactionTypeEnum.ContractTransaction, transactionAuthorizationResult, TransactionStatusEnum.ToBeConfirmation, remark, digest, attachInfo);
            case TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
                return this.updateTransactionRecord(manager, transactionRecord, TransactionStatusEnum.Completed);
            case TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
                return this.updateTransactionRecord(manager, transactionRecord, TransactionStatusEnum.Closed);
            default:
                return Promise.reject('不支持的交易处理类型');
        }
    }

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
     * @param digest
     * @param attachInfo
     * @private
     */
    private async createTransactionRecord(manager: EntityManager, fromAccount: AccountInfo, toAccount: AccountInfo, transactionAmount: number, transactionType: TransactionTypeEnum, transactionAuthorizationResult: TransactionAuthorizationResult, transactionStatus: TransactionStatusEnum, remark: string, digest: string, attachInfo?: object) {
        const confirmTimeoutDate = new Date();
        confirmTimeoutDate.setDate(confirmTimeoutDate.getDate() + 2);
        const transactionRecordInfo = {
            recordId: this.transactionHelper.generateSnowflakeId().toString(),
            accountId: fromAccount.accountId,
            accountType: fromAccount.accountType,
            accountName: fromAccount.accountName,
            reciprocalAccountId: toAccount.accountId,
            reciprocalAccountName: toAccount.accountName,
            reciprocalAccountType: toAccount.accountType,
            transactionAmount: -transactionAmount,
            transactionType: transactionType,
            remark: remark ?? '',
            digest: digest ?? '',
            operatorId: transactionAuthorizationResult.operatorId,
            operatorName: transactionAuthorizationResult.operatorName,
            authorizationType: transactionAuthorizationResult.authorizationType,
            confirmTimeoutDate: confirmTimeoutDate,
            attachInfo: attachInfo ?? {},
            status: transactionStatus,
        } as TransactionRecordInfo;

        transactionRecordInfo.saltValue = this.transactionHelper.generateSaltValue();
        transactionRecordInfo.signature = this.transactionHelper.transactionRecordSignature(transactionRecordInfo);

        await manager.insert(TransactionRecordInfo, transactionRecordInfo);

        return transactionRecordInfo;
    }

    /**
     * 修改交易记录
     * @param manager
     * @param transactionRecord
     * @param transactionStatus
     * @private
     */
    private async updateTransactionRecord(manager: EntityManager, transactionRecord: TransactionRecordInfo, transactionStatus: TransactionStatusEnum) {

        transactionRecord = cloneDeep(transactionRecord);

        transactionRecord.status = transactionStatus;
        transactionRecord.signature = this.transactionHelper.transactionRecordSignature(transactionRecord);

        await manager.update(TransactionRecordInfo, transactionRecord.recordId, {
            status: transactionRecord.status,
            signature: transactionRecord.signature,
            attachInfo: transactionRecord.attachInfo,
        });
        return transactionRecord;
    }
}
