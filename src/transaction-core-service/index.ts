import {Pipeline, Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {IPipelineHandler} from '@midwayjs/core';
import {
    AccountInfo,
    ContractTransactionInfo,
    TransactionTypeEnum,
    TransactionHandleTypeEnum,
    TransactionRecordInfo,
    TransactionDetailInfo
} from '..';
import {UserInfo, TransactionAuthorizationResult} from '../interface';
import {getConnection} from 'typeorm';
import {first} from 'lodash';
import {IPipelineResult} from '@midwayjs/core/dist/features/pipeline';
import {ApplicationError} from 'egg-freelog-base';
import {InjectEntityModel, Repository} from '../index';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionCoreService {

    @InjectEntityModel(AccountInfo)
    accountRepository: Repository<AccountInfo>;

    @Pipeline(['transactionAuthorizationHandler', 'transactionPreconditionChecker', 'transactionHandler', 'transactionRecordHandler', 'transactionDetailHandler', 'transactionNotificationHandler'])
    private transactionStages: IPipelineHandler;

    /**
     * 个人账户转账
     * @param userInfo
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param remark
     */
    async individualAccountTransfer(userInfo: UserInfo, fromAccount: AccountInfo, toAccount: AccountInfo, password: string, transactionAmount: number, remark?: string): Promise<TransactionDetailInfo> {
        const args: any = {
            userInfo, fromAccount, toAccount, password, transactionAmount, remark,
            transactionHandleType: TransactionHandleTypeEnum.ForthwithTransfer
        };
        args.transactionAuthorizationResult = await this.transactionAuthorizationAndAccountCheck(args);
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return first(transactionResult.result);
    }

    /**
     * 组织账号转账
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @param signature
     * @param digest
     * @param remark
     */
    async organizationAccountTransfer(fromAccount: AccountInfo, toAccount: AccountInfo, transactionAmount: number, signature: string, digest?: string, remark?: string): Promise<TransactionDetailInfo> {
        const args: any = {
            fromAccount, toAccount, transactionAmount, digest, remark, signature,
            transactionHandleType: TransactionHandleTypeEnum.ForthwithTransfer
        };
        args.signText = `fromAccountId_${fromAccount.accountId}_toAccountId_${toAccount.accountId}_transactionAmount_${transactionAmount}`;
        args.transactionAuthorizationResult = await this.transactionAuthorizationAndAccountCheck(args);
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return first(transactionResult.result);
    }

    /**
     * 待确认的合约支付
     * @param userInfo
     * @param contractTransactionInfo
     */
    async toBeConfirmedContractPaymentHandle(userInfo: UserInfo, contractTransactionInfo: ContractTransactionInfo): Promise<TransactionDetailInfo> {
        const args: any = {
            userInfo, contractTransactionInfo,
            fromAccount: contractTransactionInfo.fromAccount,
            toAccount: contractTransactionInfo.toAccount,
            password: contractTransactionInfo.password,
            transactionAmount: contractTransactionInfo.transactionAmount,
            remark: contractTransactionInfo.remark ?? '',
            transactionTypeEnum: TransactionTypeEnum.ContractTransaction,
            transactionHandleType: TransactionHandleTypeEnum.ToBeConfirmedContractPayment,
            attachInfo: {
                contractId: contractTransactionInfo.contractId,
                subjectType: contractTransactionInfo.subjectType,
                contractName: contractTransactionInfo.contractName,
                eventId: contractTransactionInfo.eventId
            }
        };
        args.transactionAuthorizationResult = await this.transactionAuthorizationAndAccountCheck(args);
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return first(transactionResult.result);
    }

    /**
     * 合约支付确认成功
     * @param transactionRecord
     * @param attachInfo
     */
    async contractPaymentConfirmCompletedHandle(transactionRecord: TransactionRecordInfo, attachInfo: object): Promise<TransactionDetailInfo> {
        const args: any = {
            transactionRecord, attachInfo,
            transactionHandleType: TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful
        };
        args.toAccount = await this.accountRepository.findOne(transactionRecord.reciprocalAccountId);
        transactionRecord.attachInfo = attachInfo;
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return first(transactionResult.result);
    }

    /**
     * 合约支付确认取消
     * @param transactionRecord
     */
    async contractPaymentConfirmCanceledHandle(transactionRecord: TransactionRecordInfo) {
        const args = {
            transactionRecord,
            transactionHandleType: TransactionHandleTypeEnum.ContractPaymentConfirmedCancel
        };
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return first(transactionResult.result);
    }

    /**
     * 执行交易
     * @param args
     * @private
     */
    private async execTransaction(args: any): Promise<IPipelineResult<any>> {
        return getConnection().transaction(async manager => {
            args.manager = manager;
            return this.transactionStages.waterfall({
                args,
                valves: ['transactionHandler', 'transactionRecordHandler', 'transactionDetailHandler', 'transactionNotificationHandler']
            });
        });
    }

    /**
     * 交易授权与账户状态签名余额等检查
     * @param args
     * @private
     */
    private async transactionAuthorizationAndAccountCheck(args: any): Promise<TransactionAuthorizationResult> {
        const checkResult = await this.transactionStages.concatSeries({
            valves: ['transactionAuthorizationHandler', 'transactionPreconditionChecker'],
            args: args
        });
        if (checkResult.success) {
            return first(checkResult.result as any) as TransactionAuthorizationResult;
        }

        if (checkResult.error?.error instanceof Error) {
            throw checkResult.error?.error;
        }

        return Promise.reject(new ApplicationError(`交易失败,${checkResult?.error?.error}`));
    }
}
