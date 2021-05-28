import { FreelogContext } from 'egg-freelog-base';
import { AccountHelper } from '../extend/account-helper';
import { AccountService } from '../service/account-service';
export declare class AccountInfoController {
    ctx: FreelogContext;
    accountService: AccountService;
    accountHelper: AccountHelper;
    individualAccountInfo(): Promise<import("..").AccountInfo>;
    activateAccount(): Promise<boolean>;
    updateAccount(): Promise<boolean>;
    createContractAccount(): Promise<import("..").AccountInfo>;
    createOrganizationAccount(): Promise<import("..").AccountInfo>;
    generateRsaKey(): Promise<{
        publicKey: any;
        privateKey: any;
    }>;
}
