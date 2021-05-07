import {Init, Inject, Provide} from '@midwayjs/decorator';
import {BaseService} from './abstract-base-service';
import {
    AccountInfo,
    AccountTypeEnum,
    ContractTransactionInfo,
    InjectEntityModel,
    Repository,
    TransactionDetailInfo,
    TransactionRecordInfo,
    TransactionStatusEnum
} from '..';
import {ArgumentError, FreelogContext, LogicError} from 'egg-freelog-base';
import {TransactionCoreService} from '../transaction-core-service';
import {AccountService} from './account-service';
import {testFreelogOrganizationInfo} from '../mock-data/test-freelog-organization-info';
import {RsaHelper} from '../extend/rsa-helper';

@Provide()
export class TransactionService extends BaseService<TransactionRecordInfo> {

    @Inject()
    ctx: FreelogContext;
    @Inject()
    rsaHelper: RsaHelper;
    @Inject()
    transactionCoreService: TransactionCoreService;
    @Inject()
    accountService: AccountService;
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
    async individualAccountTransfer(fromAccount: AccountInfo, toAccount: AccountInfo, password: string, transactionAmount: number, remark?: string) {
        if (!fromAccount || !toAccount || !password) {
            throw new ArgumentError('参数校验失败');
        }
        if (fromAccount.accountType !== AccountTypeEnum.IndividualAccount) {
            throw new LogicError('账号类型校验失败');
        }
        return this.transactionCoreService.individualAccountTransfer(this.ctx.identityInfo.userInfo, fromAccount, toAccount, password, transactionAmount, remark);
    }

    /**
     * 组织账号转账
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @param signature
     * @param remark
     */
    async organizationAccountTransfer(fromAccount: AccountInfo, toAccount: AccountInfo, transactionAmount: number, signature: string, remark?: string) {
        if (!fromAccount || !toAccount || !signature) {
            throw new ArgumentError('参数校验失败');
        }
        if (fromAccount.accountType !== AccountTypeEnum.OrganizationAccount) {
            throw new LogicError('账号类型校验失败');
        }
        return this.transactionCoreService.organizationAccountTransfer(fromAccount, toAccount, transactionAmount, signature, remark);
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

    /**
     * 测试代币转账(领取)
     * @param toAccountInfo
     * @param transactionAmount
     */
    async testTokenTransferSignature(toAccountInfo: AccountInfo, transactionAmount: number): Promise<string> {
        let fromAccount = await this.accountService.findOne({
            ownerId: testFreelogOrganizationInfo.organizationId.toString(),
            accountType: AccountTypeEnum.OrganizationAccount
        });
        if (!fromAccount) {
            fromAccount = await this.accountService.createOrganizationAccount();
        }
        const signText = `fromAccountId_${fromAccount.accountId}_toAccountId_${toAccountInfo.accountId}_transactionAmount_${transactionAmount}`;
        const nodeRsaHelper = this.rsaHelper.build(null, testFreelogOrganizationInfo.privateKey);
        return nodeRsaHelper.sign(signText);
    }
}
