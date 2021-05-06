import { BaseService } from './abstract-base-service';
import { AccountInfo, Repository, TransactionDetailInfo, TransactionRecordInfo } from '..';
import { FreelogContext } from 'egg-freelog-base';
import { TransactionCoreService } from '../transaction-core-service';
import { AccountService } from './account-service';
import { RsaHelper } from '../extend/rsa-helper';
export declare class TransactionService extends BaseService<TransactionRecordInfo> {
    ctx: FreelogContext;
    rsaHelper: RsaHelper;
    transactionCoreService: TransactionCoreService;
    accountService: AccountService;
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
     * @param signature
     * @param remark
     */
    organizationAccountTransfer(fromAccount: AccountInfo, toAccount: AccountInfo, transactionAmount: number, signature: string, remark?: string): Promise<TransactionDetailInfo>;
    /**
     * 待确认的合约支付
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param contractId
     * @param contractName
     * @param eventId
     * @param signature
     */
    toBeConfirmedContractPayment(fromAccount: AccountInfo, toAccount: AccountInfo, password: string, transactionAmount: number, contractId: string, contractName: string, eventId: string, signature: string): Promise<TransactionDetailInfo>;
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
     */
    testTokenTransfer(toAccountInfo: AccountInfo): Promise<TransactionDetailInfo>;
}
