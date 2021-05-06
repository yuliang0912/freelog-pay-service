import {Init, Inject, Provide} from '@midwayjs/decorator';
import {BaseService} from './abstract-base-service';
import {AccountInfo, AccountTypeEnum, InjectEntityModel, Repository} from '..';
import {AccountHelper} from '../extend/account-helper';
import {ArgumentError, FreelogContext, LogicError} from 'egg-freelog-base';
import {Decimal} from 'decimal.js-light';
import {testFreelogOrganizationInfo} from '../mock-data/test-freelog-organization-info';
import {OutsideApiService} from './outside-api-service';

@Provide()
export class AccountService extends BaseService<AccountInfo> {

    @Inject()
    ctx: FreelogContext;
    @Inject()
    accountHelper: AccountHelper;
    @Inject()
    outsideApiService: OutsideApiService;

    @InjectEntityModel(AccountInfo)
    accountRepository: Repository<AccountInfo>;

    @Init()
    constructorBaseService() {
        super.tableAlias = 'account';
        super.repository = this.accountRepository;
    }

    /**
     * 创建个人账号(未激活,也没有密码)
     */
    async createIndividualAccount(userId: number, username: string): Promise<AccountInfo> {
        await this.checkCreateAccountUniqueness(userId.toString(), AccountTypeEnum.IndividualAccount);
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(AccountTypeEnum.IndividualAccount, userId),
            accountType: AccountTypeEnum.IndividualAccount,
            accountName: username,
            ownerUserId: userId, ownerName: username,
            ownerId: userId.toString(),
            status: 0, //未激活
            balance: new Decimal(0).toFixed(2),
            freezeBalance: new Decimal(0).toFixed(2)
        } as AccountInfo;
        accountInfo.saltValue = this.accountHelper.generateSaltValue();
        accountInfo.password = '';
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        return this.accountRepository.save(accountInfo);
    }

    /**
     * 激活个人账号
     * @param accountInfo
     * @param password
     */
    async activateIndividualAccount(accountInfo: AccountInfo, password: string) {
        if (accountInfo?.status !== 0) {
            throw new LogicError('账号已激活,不能重复操作');
        }
        if (!this.accountHelper.accountSignatureVerify(accountInfo)) {
            throw new LogicError('账号签名校验失败,数据完整性校验失败');
        }
        accountInfo.password = this.accountHelper.generateAccountPassword(accountInfo.accountId, accountInfo.saltValue, accountInfo.ownerId, password);
        accountInfo.status = 1;
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        return this.accountRepository.save(accountInfo).then(() => true);
    }

    /**
     * 创建合同账号
     * @param contractId
     * @param contractName
     * @param publicKey
     */
    async createContractAccount(contractId: string, contractName: string, publicKey: string): Promise<AccountInfo> {
        await this.checkCreateAccountUniqueness(contractId, AccountTypeEnum.ContractAccount);
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(AccountTypeEnum.ContractAccount, contractId),
            accountType: AccountTypeEnum.ContractAccount,
            accountName: contractName,
            ownerId: contractId,
            status: 1,
            balance: new Decimal(0).toFixed(2),
            freezeBalance: new Decimal(0).toFixed(2)
        } as AccountInfo;
        accountInfo.password = this.accountHelper.encryptPublicKey(publicKey);
        accountInfo.saltValue = this.accountHelper.generateSaltValue();
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo as AccountInfo);
        await this.accountRepository.insert(accountInfo);
        return this.repository.findOne(accountInfo.accountId);
    }

    /**
     * 创建组织账户(目前系统没有组织信息.先模拟一个)
     */
    async createOrganizationAccount(): Promise<AccountInfo> {
        const {organizationId, organizationName, ownerUserId, ownerName, publicKey} = testFreelogOrganizationInfo;
        await this.checkCreateAccountUniqueness(organizationId.toString(), AccountTypeEnum.OrganizationAccount);
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(AccountTypeEnum.OrganizationAccount, organizationId),
            accountType: AccountTypeEnum.OrganizationAccount,
            accountName: organizationName,
            ownerUserId: ownerUserId,
            ownerId: organizationId.toString(),
            ownerName: ownerName,
            status: 1,
            balance: new Decimal(10000000).toFixed(2),
            freezeBalance: new Decimal(0).toFixed(2)
        } as AccountInfo;
        accountInfo.saltValue = this.accountHelper.generateSaltValue();
        accountInfo.password = this.accountHelper.encryptPublicKey(publicKey);
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        await this.accountRepository.insert(accountInfo);
        return this.accountRepository.findOne(accountInfo.accountId);
    }

    /**
     * 校验创建账号唯一性
     * @param ownerId
     * @param accountType
     * @private
     */
    private async checkCreateAccountUniqueness(ownerId: string, accountType: AccountTypeEnum) {
        const isExist = await this.count({ownerId: ownerId, accountType});
        if (isExist) {
            throw new LogicError('只允许创建一个交易账户');
        }
    }

    /**
     * 获取账户信息
     * @param ownerId
     * @param accountType
     */
    async getAccountInfo(ownerId: string, accountType: AccountTypeEnum): Promise<AccountInfo> {
        const accountInfo = await this.findOne({ownerId: ownerId, accountType});
        if (!accountInfo && accountType === AccountTypeEnum.IndividualAccount) {
            const userInfo = await this.outsideApiService.getUserInfo(ownerId as any);
            if (!userInfo) {
                throw new ArgumentError(`未找到用户(${ownerId})`);
            }
            return this.createIndividualAccount(userInfo.userId, userInfo.username);
        }
        return accountInfo;
    }
}
