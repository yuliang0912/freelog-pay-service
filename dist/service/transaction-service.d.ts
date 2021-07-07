import { BaseService } from './abstract-base-service';
import { AccountInfo, Repository, TransactionDetailInfo, TransactionRecordInfo } from '..';
import { FreelogContext } from 'egg-freelog-base';
import { TransactionCoreService } from '../transaction-core-service';
import { AccountService } from './account-service';
import { RsaHelper } from '../extend/rsa-helper';
import { TransactionHelper } from '../extend/transaction-helper';
export declare class TransactionService extends BaseService<TransactionDetailInfo> {
    ctx: FreelogContext;
    rsaHelper: RsaHelper;
    transactionCoreService: TransactionCoreService;
    accountService: AccountService;
    transactionHelper: TransactionHelper;
    transactionRecordRepository: Repository<TransactionRecordInfo>;
    transactionDetailRepository: Repository<TransactionDetailInfo>;
    constructorBaseService(): void;
    /**
     * 个人账号转账
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param remark
     */
    individualAccountTransfer(fromAccount: AccountInfo, toAccount: AccountInfo, password: string, transactionAmount: number, remark?: string): Promise<TransactionDetailInfo>;
    /**
     * 组织账号转账
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @param outsideTransactionId
     * @param signature
     * @param digest
     * @param remark
     */
    organizationAccountTransfer(fromAccount: AccountInfo, toAccount: AccountInfo, transactionAmount: number, outsideTransactionId: string, signature: string, digest?: string, remark?: string): Promise<TransactionDetailInfo>;
    /**
     * 待确认的合约支付
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param contractId
     * @param subjectType
     * @param contractName
     * @param eventId
     * @param signature
     */
    toBeConfirmedContractPayment(fromAccount: AccountInfo, toAccount: AccountInfo, password: string, transactionAmount: number, contractId: string, subjectType: number, contractName: string, eventId: string, signature: string): Promise<TransactionDetailInfo>;
    /**
     * 合约支付确认成功
     * @param transactionRecord
     * @param stateId
     */
    contractPaymentConfirmedSuccessful(transactionRecord: TransactionRecordInfo, stateId: string): Promise<TransactionDetailInfo>;
    /**
     * 合约支付确认取消
     * @param transactionRecord
     */
    contractPaymentConfirmedCancel(transactionRecord: TransactionRecordInfo): Promise<unknown>;
    /**
     * 测试代币转账(领取)
     * @param toAccountInfo
     * @param transactionAmount
     * @param outsideTransactionId
     */
    testTokenTransferSignature(toAccountInfo: AccountInfo, transactionAmount: number, outsideTransactionId: string): Promise<string>;
}
