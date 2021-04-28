import { FreelogContext } from 'egg-freelog-base';
import { AccountHelper } from '../extend/account-helper';
import { AccountService } from '../service/account-service';
export declare class AccountInfoController {
    ctx: FreelogContext;
    accountService: AccountService;
    accountHelper: AccountHelper;
    individualAccount(): Promise<import("..").AccountInfo>;
    create(): Promise<import("..").AccountInfo>;
    createContractAccount(): Promise<import("..").AccountInfo>;
}
