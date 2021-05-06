import { AccountInfo, ContractTransactionInfo, TransactionRecordInfo, TransactionDetailInfo } from '..';
import { UserInfo } from '../interface';
import { Repository } from '../index';
export declare class TransactionCoreService {
    accountRepository: Repository<AccountInfo>;
    private transactionStages;
    /**
     * 个人账户转账
     * @param userInfo
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param remark
     */
    individualAccountTransfer(userInfo: UserInfo, fromAccount: AccountInfo, toAccount: AccountInfo, password: string, transactionAmount: number, remark?: string): Promise<TransactionDetailInfo>;
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
     * @param userInfo
     * @param contractTransactionInfo
     */
    toBeConfirmedContractPaymentHandle(userInfo: UserInfo, contractTransactionInfo: ContractTransactionInfo): Promise<TransactionDetailInfo>;
    /**
     * 合约支付确认成功
     * @param transactionRecord
     * @param attachInfo
     */
    contractPaymentConfirmCompletedHandle(transactionRecord: TransactionRecordInfo, attachInfo: object): Promise<TransactionDetailInfo>;
    /**
     * 合约支付确认取消
     * @param transactionRecord
     */
    contractPaymentConfirmCanceledHandle(transactionRecord: TransactionRecordInfo): Promise<unknown>;
    /**
     * 执行交易
     * @param args
     * @private
     */
    private execTransaction;
    /**
     * 交易授权与账户状态签名余额等检查
     * @param args
     * @private
     */
    private transactionAuthorizationAndAccountCheck;
}
