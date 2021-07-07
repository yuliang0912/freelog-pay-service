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
        console.log(`接收到合约支付结果确认事件(offset:${message.offset})` + JSON.stringify(eventInfo));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QtcGF5bWVudC1jb25maXJtLXJlc3VsdC1oYW5kbGUuanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsibXEtZXZlbnQtaGFuZGxlci9jb250cmFjdC1wYXltZW50LWNvbmZpcm0tcmVzdWx0LWhhbmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtREFBc0U7QUFFdEUsMEJBQThGO0FBQzlGLDBFQUFtRTtBQUNuRSxvQ0FBdUQ7QUFJdkQsSUFBYSxrQ0FBa0MsR0FBL0MsTUFBYSxrQ0FBa0M7SUFVM0M7UUFIQSxvQkFBZSxHQUFHLGtFQUFrRSxDQUFDO1FBQ3JGLHVCQUFrQixHQUFHLHVDQUF1QyxDQUFDO1FBR3pELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBMkI7UUFFM0MsTUFBTSxFQUFDLE9BQU8sRUFBQyxHQUFHLE9BQU8sQ0FBQztRQUMxQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRW5GLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsMkJBQTJCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3hHLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEtBQUsseUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7WUFDM0YsT0FBTztTQUNWO1FBRUQsUUFBUSxTQUFTLENBQUMsaUJBQWlCLEVBQUU7WUFDakMsS0FBSyx5QkFBcUIsQ0FBQyxTQUFTO2dCQUNoQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7Z0JBQ2pHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLHFDQUFxQyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN2RyxPQUFPO1lBQ1gsS0FBSyx5QkFBcUIsQ0FBQyxNQUFNO2dCQUM3QixNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxvQ0FBb0MsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUMxRixPQUFPO1lBQ1g7Z0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdkIsT0FBTztTQUNkO0lBQ0wsQ0FBQztDQUNKLENBQUE7QUF2Q0c7SUFEQyxrQkFBTSxFQUFFOzhCQUNlLGlEQUFzQjtrRkFBQztBQUUvQztJQURDLHlCQUFpQixDQUFDLHlCQUFxQixDQUFDOzhCQUNaLGtCQUFVO3VGQUF3QjtBQUx0RCxrQ0FBa0M7SUFGOUMsbUJBQU8sRUFBRTtJQUNULGlCQUFLLENBQUMscUJBQVMsQ0FBQyxTQUFTLENBQUM7O0dBQ2Qsa0NBQWtDLENBMEM5QztBQTFDWSxnRkFBa0MifQ==