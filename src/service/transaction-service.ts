import {Init, Inject, Provide} from '@midwayjs/decorator';
import {BaseService} from './abstract-base-service';
import {
    AccountInfo, ContractTransactionInfo, InjectEntityModel,
    Repository, TransactionDetailInfo, TransactionRecordInfo, TransactionStatusEnum
} from '..';
import {FreelogContext, LogicError} from 'egg-freelog-base';
import {TransactionCoreService} from '../transaction-core-service';

@Provide()
export class TransactionService extends BaseService<TransactionRecordInfo> {

    @Inject()
    ctx: FreelogContext;
    @Inject()
    transactionCoreService: TransactionCoreService;
    @InjectEntityModel(AccountInfo)
    accountRepository: Repository<AccountInfo>;
    @InjectEntityModel(TransactionRecordInfo)
    transactionRecordRepository: Repository<TransactionRecordInfo>;
    @InjectEntityModel(TransactionDetailInfo)
    transactionDetailRepository: Repository<TransactionDetailInfo>;

    @Init()
    constructorBaseService() {
        super.tableAlias = 'record';
        super.repository = this.transactionRecordRepository;
    }

    /**
     * 个人账号转账
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param remark
     */
    async individualAccountTransfer(fromAccount: AccountInfo, toAccount: AccountInfo, password: number, transactionAmount: number, remark?: string) {
        return this.transactionCoreService.individualAccountTransfer(this.ctx.identityInfo.userInfo, fromAccount, toAccount, password, transactionAmount, remark);
    }

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
    async toBeConfirmedContractPayment(fromAccount: AccountInfo, toAccount: AccountInfo, password: string, transactionAmount: number, contractId: string, contractName: string, eventId: string, signature: string) {

        const contractTransactionInfo = {
            fromAccount, toAccount, password, contractId, contractName, eventId, transactionAmount
        } as ContractTransactionInfo;

        return this.transactionCoreService.toBeConfirmedContractPaymentHandle(this.ctx.identityInfo.userInfo, contractTransactionInfo);
    }

    /**
     * 合约支付确认成功
     * @param transactionRecord
     * @param stateId
     */
    async contractPaymentConfirmedSuccessful(transactionRecord: TransactionRecordInfo, stateId: string) {
        if (transactionRecord.status !== TransactionStatusEnum.ToBeConfirmation) {
            throw new LogicError('只有处理中的交易才允许做确认操作');
        }
        const attachInfo = Object.assign({}, transactionRecord.attachInfo, {stateId});
        return this.transactionCoreService.contractPaymentConfirmCompletedHandle(transactionRecord, attachInfo);
    }

    /**
     * 合约支付确认取消
     * @param transactionRecord
     */
    async contractPaymentConfirmedCancel(transactionRecord: TransactionRecordInfo) {
        if (transactionRecord.status !== TransactionStatusEnum.ToBeConfirmation) {
            throw new LogicError('只有处理中的交易才允许做确认操作');
        }
        return this.transactionCoreService.contractPaymentConfirmCanceledHandle(transactionRecord);
    }
}
