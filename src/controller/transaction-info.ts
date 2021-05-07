import {Controller, Get, Inject, Post, Provide} from '@midwayjs/decorator';
import {ArgumentError, FreelogContext, IdentityTypeEnum, visitorIdentityValidator} from 'egg-freelog-base';
import {AccountService} from '../service/account-service';
import {TransactionService} from '../service/transaction-service';
import {AccountTypeEnum, TransactionStatusEnum} from '../enum';

@Provide()
@Controller('/v2/transactions')
export class TransactionInfoController {

    @Inject()
    ctx: FreelogContext;
    @Inject()
    accountService: AccountService;
    @Inject()
    transactionService: TransactionService;

    // 交易流水记录
    @Get('/details/my')
    async myTransactionDetails() {
        const {ctx} = this;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        ctx.validateParams();

        const accountInfo = await this.accountService.getAccountInfo(ctx.userId.toString(), AccountTypeEnum.IndividualAccount);
        return this.transactionService.findPageList({where: {accountId: accountInfo.accountId}, skip, take: limit});
    }

    // 交易流水记录
    @Get('/details/:accountId')
    async transactionDetails() {
        const {ctx} = this;
        const accountId = ctx.checkParams('accountId').exist().value;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        ctx.validateParams();

        return this.transactionService.findPageList({where: {accountId}, skip, take: limit});
    }

    // 个人账户转账
    @Post('/transfer')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async transfer() {
        const {ctx} = this;
        const fromAccountId = ctx.checkBody('fromAccountId').exist().value;
        const toAccountId = ctx.checkBody('toAccountId').exist().value;
        const transactionAmount = ctx.checkBody('transactionAmount').toFloat().gt(0).value;
        const password = ctx.checkBody('password').isNumeric().len(6, 6).value;
        ctx.validateParams();

        const accounts = await this.accountService.findByIds([fromAccountId, toAccountId]);
        const toAccount = accounts.find(x => x.accountId === toAccountId);
        const fromAccount = accounts.find(x => x.accountId === fromAccountId);
        if (!toAccount || !fromAccount) {
            throw new ArgumentError('参数校验失败');
        }

        return this.transactionService.individualAccountTransfer(fromAccount, toAccount, password, transactionAmount);
    }

    // 合约交易事件-合约支付(需要合约服务确认之后才会真实扣款)
    @Post('/contracts/payment')
    @visitorIdentityValidator(IdentityTypeEnum.InternalClient)
    async contractPayment() {
        const {ctx} = this;
        const fromAccountId = ctx.checkBody('fromAccountId').exist().isNumeric().value;
        const toAccountId = ctx.checkBody('toAccountId').exist().isNumeric().value;
        const transactionAmount = ctx.checkBody('transactionAmount').exist().toFloat().gt(0).value;
        const contractId = ctx.checkBody('contractId').exist().isMongoObjectId().value;
        const contractName = ctx.checkBody('contractName').exist().type('string').value;
        const eventId = ctx.checkBody('eventId').exist().isMd5().value;
        const password = ctx.checkBody('password').exist().isNumeric().len(6, 6).value;
        this.ctx.validateParams();

        const accounts = await this.accountService.findByIds([fromAccountId, toAccountId]);
        const toAccount = accounts.find(x => x.accountId === toAccountId);
        const fromAccount = accounts.find(x => x.accountId === fromAccountId);
        if (!toAccount || !fromAccount) {
            throw new ArgumentError('参数校验失败,未找到账号信息');
        }

        return this.transactionService.toBeConfirmedContractPayment(fromAccount, toAccount, password, transactionAmount, contractId, contractName, eventId, '');
    }

    // 合约支付结果确认(测试使用的接口.可以删除)
    @Post('/contracts/paymentConfirmed')
    async contractPaymentConfirmed() {
        const {ctx} = this;
        const transactionRecordId = ctx.checkBody('transactionRecordId').exist().value;
        const transactionStatus = ctx.checkBody('transactionStatus').exist().toInt().in([TransactionStatusEnum.Closed, TransactionStatusEnum.Completed]).value;
        const stateId = ctx.checkBody('stateId').optional().isMongoObjectId().value;
        ctx.validateParams();

        const transactionRecord = await this.transactionService.transactionRecordRepository.findOne(transactionRecordId);
        if (!transactionRecord) {
            throw new ArgumentError('参数transactionRecordId校验失败');
        }
        if (transactionRecord.status === transactionStatus) {
            return this.transactionService.transactionDetailRepository.findOne({
                transactionRecordId: transactionRecord.recordId,
                accountId: transactionRecord.accountId
            });
        }
        if (transactionStatus === TransactionStatusEnum.Closed) {
            return this.transactionService.contractPaymentConfirmedCancel(transactionRecord);
        }
        if (transactionStatus === TransactionStatusEnum.Completed) {
            return this.transactionService.contractPaymentConfirmedSuccessful(transactionRecord, stateId);
        }
    }

    // 查询交易记录详情
    @Get('/records/:recordId')
    @visitorIdentityValidator(IdentityTypeEnum.InternalClient)
    async transactionRecordDetail() {
        const {ctx} = this;
        const recordId = ctx.checkParams('recordId').exist().isNumeric().value;
        ctx.validateParams();
        return this.transactionService.transactionRecordRepository.findOne(recordId);
    }

    // 组织账户转账
    @Post('/organizationTransfer')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async organizationTransfer() {
        const {ctx} = this;
        const fromAccountId = ctx.checkBody('fromAccountId').exist().value;
        const toAccountId = ctx.checkBody('toAccountId').exist().value;
        const transactionAmount = ctx.checkBody('transactionAmount').toFloat().gt(0).value;
        const signature = ctx.checkBody('signature').exist().value;
        const remark = ctx.checkBody('remark').optional().type('string').len(0, 200).value;
        ctx.validateParams();

        // 签约文本构成格式 (私钥进行签名)
        // signText = `fromAccountId_${fromAccount.accountId}_toAccountId_${toAccount.accountId}_transactionAmount_${transactionAmount}`;
        const accounts = await this.accountService.findByIds([fromAccountId, toAccountId]);
        const toAccount = accounts.find(x => x.accountId === toAccountId);
        const fromAccount = accounts.find(x => x.accountId === fromAccountId);
        if (!toAccount || !fromAccount) {
            throw new ArgumentError('参数校验失败');
        }

        return this.transactionService.organizationAccountTransfer(fromAccount, toAccount, transactionAmount, signature, remark);
    }

    // 测试代币交易签名
    @Post('/testTokenTransferSignature')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async testTokenTransfer() {
        const {ctx} = this;
        const userId = ctx.checkBody('userId').exist().isUserId().toInt().value;
        const transactionAmount = ctx.checkBody('transactionAmount').toFloat().gt(0).value;
        ctx.validateParams();

        const toAccount = await this.accountService.getAccountInfo(userId.toString(), AccountTypeEnum.IndividualAccount);
        if (!toAccount) {
            throw new ArgumentError('参数校验失败');
        }
        const signature = await this.transactionService.testTokenTransferSignature(toAccount, transactionAmount);
        return {signature};
    }
}
