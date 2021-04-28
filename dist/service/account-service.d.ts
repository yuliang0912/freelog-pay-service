import { BaseService } from './abstract-base-service';
import { AccountInfo, Repository } from '..';
import { FindOneOptions } from 'typeorm';
import { AccountHelper } from '../extend/account-helper';
import { FreelogContext } from 'egg-freelog-base';
export declare class AccountService extends BaseService<AccountInfo> {
    ctx: FreelogContext;
    accountHelper: AccountHelper;
    accountRepository: Repository<AccountInfo>;
    constructorBaseService(): void;
    /**
     * 创建账号
     * @param password
     */
    createIndividualAccount(password: number): Promise<AccountInfo>;
    /**
     * 创建合同账号
     * @param contractId
     * @param contractName
     * @param publicKey
     */
    createContractAccount(contractId: string, contractName: string, publicKey: string): Promise<AccountInfo>;
    /**
     * 获取账户信息
     * @param condition
     */
    getAccountInfo(condition: FindOneOptions<AccountInfo>): Promise<AccountInfo>;
}
