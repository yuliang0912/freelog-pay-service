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
exports.ContractPaymentConfirmResultHandle = void 0;
const decorator_1 = require("@midwayjs/decorator");
const __1 = require("..");
const transaction_core_service_1 = require("../transaction-core-service");
const index_1 = require("../index");
let ContractPaymentConfirmResultHandle = class ContractPaymentConfirmResultHandle {
    constructor() {
        this.consumerGroupId = 'freelog-pay-service#contract-payment-confirm-result-handle-group';
        this.subscribeTopicName = 'contract-payment-confirm-result-topic';
        this.messageHandle = this.messageHandle.bind(this);
    }
    /**
     * 合约支付确认结果处理
     * @param payload
     */
    async messageHandle(payload) {
        const { message } = payload;
        const eventInfo = JSON.parse(message.value.toString());
        console.log('接收到合约支付结果确认事件' + JSON.stringify(eventInfo));
        const transactionRecord = await this.transactionRecordRepository.findOne(eventInfo.transactionRecordId);
        if (!transactionRecord || transactionRecord.status !== __1.TransactionStatusEnum.ToBeConfirmation) {
            return;
        }
        switch (eventInfo.transactionStatus) {
            case __1.TransactionStatusEnum.Completed:
                const attachInfo = Object.assign({}, transactionRecord.attachInfo, { stateId: eventInfo.stateId });
                await this.transactionCoreService.contractPaymentConfirmCompletedHandle(transactionRecord, attachInfo);
                return;
            case __1.TransactionStatusEnum.Closed:
                await this.transactionCoreService.contractPaymentConfirmCanceledHandle(transactionRecord);
                return;
            default:
                console.log('错误的数据格式');
                return;
        }
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", transaction_core_service_1.TransactionCoreService)
], ContractPaymentConfirmResultHandle.prototype, "transactionCoreService", void 0);
__decorate([
    index_1.InjectEntityModel(__1.TransactionRecordInfo),
    __metadata("design:type", index_1.Repository)
], ContractPaymentConfirmResultHandle.prototype, "transactionRecordRepository", void 0);
ContractPaymentConfirmResultHandle = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton),
    __metadata("design:paramtypes", [])
], ContractPaymentConfirmResultHandle);
exports.ContractPaymentConfirmResultHandle = ContractPaymentConfirmResultHandle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QtcGF5bWVudC1jb25maXJtLXJlc3VsdC1oYW5kbGUuanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsibXEtZXZlbnQtaGFuZGxlci9jb250cmFjdC1wYXltZW50LWNvbmZpcm0tcmVzdWx0LWhhbmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtREFBc0U7QUFFdEUsMEJBQThGO0FBQzlGLDBFQUFtRTtBQUNuRSxvQ0FBdUQ7QUFJdkQsSUFBYSxrQ0FBa0MsR0FBL0MsTUFBYSxrQ0FBa0M7SUFVM0M7UUFIQSxvQkFBZSxHQUFHLGtFQUFrRSxDQUFDO1FBQ3JGLHVCQUFrQixHQUFHLHVDQUF1QyxDQUFDO1FBR3pELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBMkI7UUFFM0MsTUFBTSxFQUFDLE9BQU8sRUFBQyxHQUFHLE9BQU8sQ0FBQztRQUMxQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFekQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDeEcsSUFBSSxDQUFDLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLE1BQU0sS0FBSyx5QkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtZQUMzRixPQUFPO1NBQ1Y7UUFFRCxRQUFRLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRTtZQUNqQyxLQUFLLHlCQUFxQixDQUFDLFNBQVM7Z0JBQ2hDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztnQkFDakcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMscUNBQXFDLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZHLE9BQU87WUFDWCxLQUFLLHlCQUFxQixDQUFDLE1BQU07Z0JBQzdCLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLG9DQUFvQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQzFGLE9BQU87WUFDWDtnQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN2QixPQUFPO1NBQ2Q7SUFDTCxDQUFDO0NBQ0osQ0FBQTtBQXZDRztJQURDLGtCQUFNLEVBQUU7OEJBQ2UsaURBQXNCO2tGQUFDO0FBRS9DO0lBREMseUJBQWlCLENBQUMseUJBQXFCLENBQUM7OEJBQ1osa0JBQVU7dUZBQXdCO0FBTHRELGtDQUFrQztJQUY5QyxtQkFBTyxFQUFFO0lBQ1QsaUJBQUssQ0FBQyxxQkFBUyxDQUFDLFNBQVMsQ0FBQzs7R0FDZCxrQ0FBa0MsQ0EwQzlDO0FBMUNZLGdGQUFrQyJ9