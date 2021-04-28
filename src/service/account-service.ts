import {Init, Inject, Provide} from '@midwayjs/decorator';
import {BaseService} from './abstract-base-service';
import {AccountInfo, AccountTypeEnum, InjectEntityModel, Repository, UserInfo} from '..';
import {FindOneOptions} from 'typeorm';
import {AccountHelper} from '../extend/account-helper';
import {FreelogContext, LogicError} from 'egg-freelog-base';
import {v4} from 'uuid';

@Provide()
export class AccountService extends BaseService<AccountInfo> {

    @Inject()
    ctx: FreelogContext;
    @Inject()
    accountHelper: AccountHelper;

    @InjectEntityModel(AccountInfo)
    accountRepository: Repository<AccountInfo>;

    @Init()
    constructorBaseService() {
        super.tableAlias = 'account';
        super.repository = this.accountRepository;
    }

    /**
     * 创建账号
     * @param password
     */
    async createIndividualAccount(password: number): Promise<AccountInfo> {
        const isExist = await this.count({
            ownerUserId: this.ctx.userId, accountType: AccountTypeEnum.IndividualAccount
        });
        if (isExist) {
            throw new LogicError('只允许创建一个交易账户');
        }

        const userInfo: UserInfo = this.ctx.identityInfo.userInfo;
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(AccountTypeEnum.IndividualAccount, userInfo.userId),
            accountType: AccountTypeEnum.IndividualAccount,
            accountName: userInfo.username,
            ownerUserId: userInfo.userId, ownerName: userInfo.username,
            ownerId: userInfo.userId.toString(),
            status: 1,
            balance: '0',
            freezeBalance: '0',
        } as AccountInfo;
        accountInfo.saltValue = (v4() + v4()).replace(/-/g, '');
        accountInfo.password = this.accountHelper.generateAccountPassword(accountInfo.accountId, accountInfo.saltValue, accountInfo.ownerId, password);
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo as AccountInfo);
        return this.accountRepository.save(accountInfo as AccountInfo);
    }

    /**
     * 创建合同账号
     * @param contractId
     * @param contractName
     * @param publicKey
     */
    async createContractAccount(contractId: string, contractName: string, publicKey: string): Promise<AccountInfo> {
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(AccountTypeEnum.ContractAccount, contractId),
            accountType: AccountTypeEnum.ContractAccount,
            accountName: contractName,
            ownerId: contractId,
            status: 1
        } as AccountInfo;
        accountInfo.password = this.accountHelper.encryptPublicKey(publicKey);
        accountInfo.saltValue = this.accountHelper.generateSaltValue();
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo as AccountInfo);
        return this.accountRepository.save(accountInfo);
    }

    /**
     * 获取账户信息
     * @param condition
     */
    async getAccountInfo(condition: FindOneOptions<AccountInfo>) {
        return this.findOne(condition);
    }
}
