import {IPipelineContext, IValveHandler} from '@midwayjs/core'
import {Inject, Provide, Scope, ScopeEnum} from "@midwayjs/decorator";
import {EntityManager} from 'typeorm';
import {
    AccountInfo, TransactionDetailInfo,
    TransactionHandleTypeEnum, TransactionRecordInfo, TransactionStatusEnum
} from '..';
import Decimal from 'decimal.js-light';
import {TransactionHelper} from '../extend/transaction-helper';
import {pick} from 'lodash';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionDetailHandler implements IValveHandler {

    @Inject()
    transactionHelper: TransactionHelper;

    alias = 'transactionDetailHandler';

    /**
     * 保存交易记录
     * @param ctx
     */
    async invoke(ctx: IPipelineContext): Promise<TransactionDetailInfo[]> {

        const transactionRecord = ctx.info.prevValue as TransactionRecordInfo;
        const {manager, toAccount, fromAccount, transactionHandleType} = ctx.args;
        switch (transactionHandleType as TransactionHandleTypeEnum) {
            case TransactionHandleTypeEnum.ForthwithTransfer:
                return this.createBidirectionalTransactionDetail(manager, fromAccount, toAccount, transactionRecord);
            case TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                return this.createToBeConfirmationTransactionDetail(manager, fromAccount, transactionRecord)
            case TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
                return this.contractPaymentConfirmedSuccessfulHandle(manager, toAccount, transactionRecord);
            case TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
                return this.contractPaymentConfirmedCancelHandle(manager, transactionRecord)
            default:
                return Promise.reject('不支持的交易处理类型');
        }
    }

    /**
     * 合约支付确认成功处理
     * @param manager
     * @param toAccountInfo
     * @param transactionRecord
     * @private
     */
    private async contractPaymentConfirmedSuccessfulHandle(manager: EntityManager, toAccountInfo: AccountInfo, transactionRecord: TransactionRecordInfo) {

        const expenditureTransactionDetail = await manager.findOne(TransactionDetailInfo, {
            transactionRecordId: transactionRecord.recordId,
            accountId: transactionRecord.accountId
        });

        expenditureTransactionDetail.updateDate = new Date();
        expenditureTransactionDetail.attachInfo = transactionRecord.attachInfo;
        expenditureTransactionDetail.status = TransactionStatusEnum.Completed;
        expenditureTransactionDetail.signature = this.transactionHelper.transactionDetailSignature(expenditureTransactionDetail);

        await manager.update(TransactionDetailInfo, {serialNo: expenditureTransactionDetail.serialNo}, pick(expenditureTransactionDetail, ['attachInfo', 'status', 'signature']));

        const incomeTransactionDetail = {
            transactionRecordId: transactionRecord.recordId,
            accountId: transactionRecord.reciprocalAccountId,
            accountName: transactionRecord.reciprocalAccountName,
            accountType: transactionRecord.reciprocalAccountType,
            reciprocalAccountId: transactionRecord.accountId,
            reciprocalAccountName: transactionRecord.accountName,
            reciprocalAccountType: transactionRecord.accountType,
            transactionAmount: -transactionRecord.transactionAmount,
            beforeBalance: toAccountInfo.balance,
            afterBalance: new Decimal(toAccountInfo.balance).add(-transactionRecord.transactionAmount).toFixed(2),
            transactionType: transactionRecord.transactionType,
            status: TransactionStatusEnum.Completed,
            attachInfo: transactionRecord.attachInfo
        } as TransactionDetailInfo;

        await this.saveTransactionDetails(manager, [incomeTransactionDetail]);

        return [expenditureTransactionDetail, incomeTransactionDetail];
    }

    /**
     * 合约支付确认取消处理
     * @param manager
     * @param transactionRecordInfo
     * @private
     */
    private async contractPaymentConfirmedCancelHandle(manager: EntityManager, transactionRecordInfo: TransactionRecordInfo) {
        const expenditureTransactionDetail = await manager.findOne(TransactionDetailInfo, {
            transactionRecordId: transactionRecordInfo.recordId,
            accountId: transactionRecordInfo.accountId
        });

        expenditureTransactionDetail.updateDate = new Date();
        expenditureTransactionDetail.status = TransactionStatusEnum.Closed;
        expenditureTransactionDetail.signature = this.transactionHelper.transactionDetailSignature(expenditureTransactionDetail);

        await manager.update(TransactionDetailInfo, {serialNo: expenditureTransactionDetail.serialNo}, pick(expenditureTransactionDetail, ['status', 'signature']));

        return [expenditureTransactionDetail];
    }

    /**
     * 保存待确认中的交易明细
     * @param manager
     * @param fromAccountInfo
     * @param transactionRecordInfo
     * @private
     */
    private async createToBeConfirmationTransactionDetail(manager: EntityManager, fromAccountInfo: AccountInfo, transactionRecordInfo: TransactionRecordInfo): Promise<TransactionDetailInfo[]> {

        const transactionDetailInfo = {
            transactionRecordId: transactionRecordInfo.recordId,
            accountId: transactionRecordInfo.accountId,
            accountType: transactionRecordInfo.accountType,
            accountName: transactionRecordInfo.accountName,
            reciprocalAccountId: transactionRecordInfo.reciprocalAccountId,
            reciprocalAccountName: transactionRecordInfo.reciprocalAccountName,
            reciprocalAccountType: transactionRecordInfo.reciprocalAccountType,
            transactionAmount: transactionRecordInfo.transactionAmount,
            beforeBalance: fromAccountInfo.balance,
            afterBalance: new Decimal(fromAccountInfo.balance).add(transactionRecordInfo.transactionAmount).toFixed(2),
            transactionType: transactionRecordInfo.transactionType,
            status: TransactionStatusEnum.ToBeConfirmation,
            attachInfo: transactionRecordInfo.attachInfo,
            remark: transactionRecordInfo.remark ?? ''
        } as TransactionDetailInfo;

        return this.saveTransactionDetails(manager, [transactionDetailInfo]);
    }

    /**
     * 创建双向交易记录(交易完成时,入账和出账记录同时生成)
     * @param manager
     * @param fromAccountInfo
     * @param toAccountInfo
     * @param transactionRecordInfo
     * @private
     */
    private async createBidirectionalTransactionDetail(manager: EntityManager, fromAccountInfo: AccountInfo, toAccountInfo: AccountInfo, transactionRecordInfo: TransactionRecordInfo) {

        const expenditureTransactionDetail = {
            transactionRecordId: transactionRecordInfo.recordId,
            accountId: transactionRecordInfo.accountId,
            accountType: transactionRecordInfo.accountType,
            accountName: transactionRecordInfo.accountName,
            reciprocalAccountId: transactionRecordInfo.reciprocalAccountId,
            reciprocalAccountName: transactionRecordInfo.reciprocalAccountName,
            reciprocalAccountType: transactionRecordInfo.reciprocalAccountType,
            transactionAmount: transactionRecordInfo.transactionAmount,
            beforeBalance: fromAccountInfo.balance,
            afterBalance: new Decimal(fromAccountInfo.balance).add(transactionRecordInfo.transactionAmount).toFixed(2),
            transactionType: transactionRecordInfo.transactionType,
            status: TransactionStatusEnum.Completed,
            attachInfo: transactionRecordInfo.attachInfo,
            remark: transactionRecordInfo.remark ?? ''
        } as TransactionDetailInfo;

        const incomeTransactionDetail = {
            transactionRecordId: transactionRecordInfo.recordId,
            accountId: transactionRecordInfo.reciprocalAccountId,
            accountName: transactionRecordInfo.reciprocalAccountName,
            accountType: transactionRecordInfo.reciprocalAccountType,
            reciprocalAccountId: transactionRecordInfo.accountId,
            reciprocalAccountName: transactionRecordInfo.accountName,
            reciprocalAccountType: transactionRecordInfo.accountType,
            transactionAmount: -transactionRecordInfo.transactionAmount,
            beforeBalance: toAccountInfo.balance,
            afterBalance: new Decimal(toAccountInfo.balance).add(-transactionRecordInfo.transactionAmount).toFixed(2),
            transactionType: transactionRecordInfo.transactionType,
            status: TransactionStatusEnum.Completed,
            attachInfo: transactionRecordInfo.attachInfo
        } as TransactionDetailInfo;

        return this.saveTransactionDetails(manager, [expenditureTransactionDetail, incomeTransactionDetail]);
    }

    /**
     * 保存交易记录数据
     * @param manager
     * @param transactionDetails
     * @private
     */
    private async saveTransactionDetails(manager: EntityManager, transactionDetails: TransactionDetailInfo[]): Promise<TransactionDetailInfo[]> {

        for (const transactionDetailInfo of transactionDetails) {
            transactionDetailInfo.serialNo = this.transactionHelper.generateSnowflakeId().toString();
            transactionDetailInfo.saltValue = this.transactionHelper.generateSaltValue();
            transactionDetailInfo.signature = this.transactionHelper.transactionDetailSignature(transactionDetailInfo);
        }

        await manager.insert(TransactionDetailInfo, transactionDetails);

        return transactionDetails;
    }
}
