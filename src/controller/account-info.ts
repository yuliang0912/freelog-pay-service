import {Controller, Get, Inject, Post, Provide, Put} from '@midwayjs/decorator';
import {ArgumentError, FreelogContext, IdentityTypeEnum, visitorIdentityValidator} from 'egg-freelog-base';
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
    @Get('/individualAccounts')
    async individualAccount() {
        return this.accountService.getAccountInfo(this.ctx.userId.toString(), AccountTypeEnum.IndividualAccount);
    }

    // 个人账号
    @Get('/individualAccounts/:userId')
    @visitorIdentityValidator(IdentityTypeEnum.InternalClient | IdentityTypeEnum.LoginUser)
    async individualAccountInfo() {
        const {ctx} = this;
        const ownerUserId = ctx.checkParams('userId').exist().isUserId().value;
        ctx.validateParams();

        return this.accountService.getAccountInfo(ownerUserId, AccountTypeEnum.IndividualAccount);
    }

    // 激活账号
    @Put('/individualAccounts/activate')
    async activateAccount() {
        const ctx = this.ctx;
        const password = ctx.checkBody('password').isNumeric().len(6, 6).value;
        ctx.validateParams();

        const accountInfo = await this.accountService.getAccountInfo(this.ctx.userId.toString(), AccountTypeEnum.IndividualAccount);
        return this.accountService.activateIndividualAccount(accountInfo, password);
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

    // 创建组织账户
    @Post('/organizationAccounts/:organizationId')
    async createOrganizationAccount() {
        // const ctx = this.ctx;
        // const organizationId = ctx.checkParams('organizationId').exist().toInt().value;
        // const publicKey = ctx.checkBody('publicKey').exist().value;
        // ctx.validateParams();
        //
        // const nodeRsa = new NodeRSA(publicKey);
        // if (!nodeRsa.isPublic) {
        //     throw new ArgumentError('publicKey不是一个有效的rsa-public-key');
        // }
        return this.accountService.createOrganizationAccount();
    }

    @Get('/rasKey')
    async generateRsaKey() {
        const bit = this.ctx.checkQuery('bit').optional().toInt().default(256).value;
        const nodeRsa = new NodeRSA({b: bit});
        console.log(nodeRsa.exportKey('pkcs1-public-pem'), '\n', nodeRsa.exportKey('pkcs1-private-pem'));
        return {
            publicKey: nodeRsa.exportKey('pkcs1-public-pem'),
            privateKey: nodeRsa.exportKey('pkcs1-private-pem')
        };
    }
}
