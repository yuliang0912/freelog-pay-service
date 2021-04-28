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
        this.subscribeTopicName = 'contract-payment-confirm-result--topic';
        this.messageHandle = this.messageHandle.bind(this);
    }
    /**
     * 合约支付确认结果处理
     * @param payload
     */
    async messageHandle(payload) {
        const { batch, resolveOffset, heartbeat } = payload;
        for (let message of batch.messages) {
            const eventInfo = JSON.parse(message.value.toString());
            console.log('接收到合约支付结果确认事件' + JSON.stringify(eventInfo));
            const transactionRecord = await this.transactionRecordRepository.findOne(eventInfo.transactionRecordId);
            if (!transactionRecord || transactionRecord.status !== __1.TransactionStatusEnum.ToBeConfirmation) {
                // .... 容错处理
                resolveOffset(message.offset);
                continue;
            }
            let handler = null;
            switch (eventInfo.transactionStatus) {
                case __1.TransactionStatusEnum.Completed:
                    const attachInfo = Object.assign({}, transactionRecord.attachInfo, { stateId: eventInfo.stateId });
                    handler = this.transactionCoreService.contractPaymentConfirmCompletedHandle(transactionRecord, attachInfo);
                    break;
                case __1.TransactionStatusEnum.Closed:
                    handler = this.transactionCoreService.contractPaymentConfirmCanceledHandle(transactionRecord);
                    break;
                default:
                    console.log('错误的数据格式');
                    return;
            }
            await handler.then(() => {
                resolveOffset(message.offset);
            });
        }
        await heartbeat();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QtcGF5bWVudC1jb25maXJtLXJlc3VsdC1oYW5kbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbXEtZXZlbnQtaGFuZGxlci9jb250cmFjdC1wYXltZW50LWNvbmZpcm0tcmVzdWx0LWhhbmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtREFBc0U7QUFFdEUsMEJBQThGO0FBQzlGLDBFQUFtRTtBQUNuRSxvQ0FBdUQ7QUFJdkQsSUFBYSxrQ0FBa0MsR0FBL0MsTUFBYSxrQ0FBa0M7SUFVM0M7UUFIQSxvQkFBZSxHQUFHLGtFQUFrRSxDQUFDO1FBQ3JGLHVCQUFrQixHQUFHLHdDQUF3QyxDQUFDO1FBRzFELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBeUI7UUFDekMsTUFBTSxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ2xELEtBQUssSUFBSSxPQUFPLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUVoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFFekQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDeEcsSUFBSSxDQUFDLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLE1BQU0sS0FBSyx5QkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDM0YsWUFBWTtnQkFDWixhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM5QixTQUFTO2FBQ1o7WUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDbkIsUUFBUSxTQUFTLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ2pDLEtBQUsseUJBQXFCLENBQUMsU0FBUztvQkFDaEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLENBQUMsVUFBVSxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO29CQUNqRyxPQUFPLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLHFDQUFxQyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUMzRyxNQUFNO2dCQUNWLEtBQUsseUJBQXFCLENBQUMsTUFBTTtvQkFDN0IsT0FBTyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxvQ0FBb0MsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUM5RixNQUFNO2dCQUNWO29CQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3ZCLE9BQU87YUFDZDtZQUNELE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BCLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUNELE1BQU0sU0FBUyxFQUFFLENBQUM7SUFDdEIsQ0FBQztDQUNKLENBQUE7QUFoREc7SUFEQyxrQkFBTSxFQUFFOzhCQUNlLGlEQUFzQjtrRkFBQztBQUUvQztJQURDLHlCQUFpQixDQUFDLHlCQUFxQixDQUFDOzhCQUNaLGtCQUFVO3VGQUF3QjtBQUx0RCxrQ0FBa0M7SUFGOUMsbUJBQU8sRUFBRTtJQUNULGlCQUFLLENBQUMscUJBQVMsQ0FBQyxTQUFTLENBQUM7O0dBQ2Qsa0NBQWtDLENBbUQ5QztBQW5EWSxnRkFBa0MifQ==