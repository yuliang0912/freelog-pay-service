import { BaseService } from './abstract-base-service';
import { AccountInfo, AccountTypeEnum, Repository } from '..';
import { AccountHelper } from '../extend/account-helper';
import { FreelogContext } from 'egg-freelog-base';
import { OutsideApiService } from './outside-api-service';
export declare class AccountService extends BaseService<AccountInfo> {
    ctx: FreelogContext;
    accountHelper: AccountHelper;
    outsideApiService: OutsideApiService;
    accountRepository: Repository<AccountInfo>;
    constructorBaseService(): void;
    /**
     * 创建个人账号(未激活,也没有密码)
     */
    createIndividualAccount(userId: number, username: string): Promise<AccountInfo>;
    /**
     * 激活个人账号
     * @param accountInfo
     * @param password
     */
    activateIndividualAccount(accountInfo: AccountInfo, password: string): Promise<boolean>;
    /**
     * 创建合同账号
     * @param contractId
     * @param contractName
     * @param publicKey
     */
    createContractAccount(contractId: string, contractName: string, publicKey: string): Promise<AccountInfo>;
    /**
     * 创建组织账户(目前系统没有组织信息.先模拟一个)
     */
    createOrganizationAccount(): Promise<AccountInfo>;
    /**
     * 校验创建账号唯一性
     * @param ownerId
     * @param accountType
     * @private
     */
    private checkCreateAccountUniqueness;
    /**
     * 获取账户信息
     * @param ownerId
     * @param accountType
     */
    getAccountInfo(ownerId: string, accountType: AccountTypeEnum): Promise<AccountInfo>;
}
