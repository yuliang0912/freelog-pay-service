import {Controller, Get, Inject, Provide, Post} from '@midwayjs/decorator';
import {ArgumentError, FreelogContext} from 'egg-freelog-base';
import * as NodeRSA from 'node-rsa';
import {AccountTypeEnum} from '../enum';
import {AccountHelper} from '../extend/account-helper';
import {AccountService} from '../service/account-service';

@Provide()
@Controller('/v2/accounts')
export class AccountInfoController {

    @Inject()
    ctx: FreelogContext;
    @Inject()
    accountService: AccountService;
    @Inject()
    accountHelper: AccountHelper;

    // 个人账号
    @Get('/individualAccount')
    async individualAccount() {
        return this.accountService.getAccountInfo({
            where: {ownerUserId: this.ctx.userId, accountType: AccountTypeEnum.IndividualAccount}
        });
    }

    // 创建个人账户
    @Post('/individualAccounts')
    async create() {
        const ctx = this.ctx;
        const password = ctx.checkBody('password').exist().isNumeric().len(6, 6).value;
        ctx.validateParams();

        return this.accountService.createIndividualAccount(password);
    }

    // 创建合约账户(此处需要做幂等,一个合约只能创建一个账户,权限需要设置为内部调用权限)
    @Post('/contractAccounts/:contractId')
    async createContractAccount() {
        const ctx = this.ctx;
        const contractId = ctx.checkParams('contractId').exist().isMongoObjectId().value;
        const contractName = ctx.checkBody('contractName').exist().len(0, 128).value;
        const publicKey = ctx.checkBody('publicKey').exist().decodeURIComponent().value;
        ctx.validateParams();

        const nodeRsa = new NodeRSA(publicKey);
        if (!nodeRsa.isPublic) {
            throw new ArgumentError('publicKey不是一个有效的rsa-public-key');
        }

        const accountInfo = await this.accountService.findOne({ownerId: contractId});
        if (accountInfo) {
            return accountInfo;
        }

        return this.accountService.createContractAccount(contractId, contractName, publicKey);
    }
}
