"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionInfoController = void 0;
const decorator_1 = require("@midwayjs/decorator");
const egg_freelog_base_1 = require("egg-freelog-base");
const account_service_1 = require("../service/account-service");
const transaction_service_1 = require("../service/transaction-service");
const enum_1 = require("../enum");
let TransactionInfoController = class TransactionInfoController {
    /**
     * 交易流水记录
     */
    async myTransactionDetails() {
    }
    /**
     * 交易流水记录
     */
    async transactionDetails() {
    }
    /**
     * 转账
     */
    async transfer() {
        const fromAccountId = this.ctx.checkBody('fromAccountId').exist().value;
        const toAccountId = this.ctx.checkBody('toAccountId').exist().value;
        const transactionAmount = this.ctx.checkBody('transactionAmount').toFloat().gt(0).value;
        const password = this.ctx.checkBody('password').isNumeric().len(6, 6).value;
        this.ctx.validateParams();
        const accounts = await this.accountService.findByIds([fromAccountId, toAccountId]);
        const toAccount = accounts.find(x => x.accountId === toAccountId);
        const fromAccount = accounts.find(x => x.accountId === fromAccountId);
        if (!toAccount || !fromAccount) {
            throw new egg_freelog_base_1.ArgumentError('参数校验失败');
        }
        return this.transactionService.individualAccountTransfer(fromAccount, toAccount, password, transactionAmount);
    }
    /**
     * 合约支付(需要合约服务确认之后才会真实扣款)
     */
    // @visitorIdentityValidator(IdentityTypeEnum.InternalClient)
    async contractPayment() {
        const { ctx } = this;
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
            throw new egg_freelog_base_1.ArgumentError('参数校验失败');
        }
        return this.transactionService.toBeConfirmedContractPayment(fromAccount, toAccount, password, transactionAmount, contractId, contractName, eventId, '');
    }
    /**
     * 合约支付结果确认(测试使用的接口.可以删除)
     */
    async contractPaymentConfirmed() {
        const { ctx } = this;
        const transactionRecordId = ctx.checkBody('transactionRecordId').exist().value;
        const transactionStatus = ctx.checkBody('transactionStatus').exist().toInt().in([enum_1.TransactionStatusEnum.Closed, enum_1.TransactionStatusEnum.Completed]).value;
        const stateId = ctx.checkBody('stateId').optional().isMongoObjectId().value;
        ctx.validateParams();
        const transactionRecord = await this.transactionService.transactionRecordRepository.findOne(transactionRecordId);
        if (!transactionRecord) {
            throw new egg_freelog_base_1.ArgumentError('参数transactionRecordId校验失败');
        }
        if (transactionRecord.status === transactionStatus) {
            return this.transactionService.transactionDetailRepository.findOne({
                transactionRecordId: transactionRecord.recordId,
                accountId: transactionRecord.accountId
            });
        }
        if (transactionStatus === enum_1.TransactionStatusEnum.Closed) {
            return this.transactionService.contractPaymentConfirmedCancel(transactionRecord);
        }
        if (transactionStatus === enum_1.TransactionStatusEnum.Completed) {
            return this.transactionService.contractPaymentConfirmedSuccessful(transactionRecord, stateId);
        }
    }
    /**
     * 查询交易记录详情
     */
    // @visitorIdentityValidator(IdentityTypeEnum.InternalClient)
    async transactionRecordDetail() {
        const { ctx } = this;
        const recordId = ctx.checkParams('recordId').exist().isNumeric().value;
        ctx.validateParams();
        return this.transactionService.transactionRecordRepository.findOne(recordId);
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], TransactionInfoController.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_service_1.AccountService)
], TransactionInfoController.prototype, "accountService", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", transaction_service_1.TransactionService)
], TransactionInfoController.prototype, "transactionService", void 0);
__decorate([
    decorator_1.Get('/details/my'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionInfoController.prototype, "myTransactionDetails", null);
__decorate([
    decorator_1.Get('/details/:accountId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionInfoController.prototype, "transactionDetails", null);
__decorate([
    decorator_1.Post('/transfer'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionInfoController.prototype, "transfer", null);
__decorate([
    decorator_1.Post('/contracts/payment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionInfoController.prototype, "contractPayment", null);
__decorate([
    decorator_1.Post('/contracts/paymentConfirmed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionInfoController.prototype, "contractPaymentConfirmed", null);
__decorate([
    decorator_1.Get('/records/:recordId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionInfoController.prototype, "transactionRecordDetail", null);
TransactionInfoController = __decorate([
    decorator_1.Provide(),
    decorator_1.Controller('/v2/transactions')
], TransactionInfoController);
exports.TransactionInfoController = TransactionInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24taW5mby5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVyL3RyYW5zYWN0aW9uLWluZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQTJFO0FBQzNFLHVEQUEyRztBQUMzRyxnRUFBMEQ7QUFDMUQsd0VBQWtFO0FBQ2xFLGtDQUE4QztBQUk5QyxJQUFhLHlCQUF5QixHQUF0QyxNQUFhLHlCQUF5QjtJQVNsQzs7T0FFRztJQUVILEtBQUssQ0FBQyxvQkFBb0I7SUFFMUIsQ0FBQztJQUVEOztPQUVHO0lBRUgsS0FBSyxDQUFDLGtCQUFrQjtJQUV4QixDQUFDO0lBRUQ7O09BRUc7SUFHSCxLQUFLLENBQUMsUUFBUTtRQUNWLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN4RSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDcEUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDeEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDNUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUUxQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFj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