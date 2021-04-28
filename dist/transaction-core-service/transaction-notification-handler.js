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
exports.TransactionNotificationHandler = void 0;
const decorator_1 = require("@midwayjs/decorator");
const __1 = require("..");
const lodash_1 = require("lodash");
const client_1 = require("../kafka/client");
let TransactionNotificationHandler = class TransactionNotificationHandler {
    constructor() {
        this.alias = 'transactionNotificationHandler';
    }
    /**
     * 消息通知
     * @param ctx
     */
    async invoke(ctx) {
        const { transactionHandleType } = ctx.args;
        switch (transactionHandleType) {
            case __1.TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                const transactionDetail = lodash_1.first(ctx.info.prevValue);
                await this.toBeConfirmedContractPaymentMessageNotificationHandle(transactionDetail);
                break;
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
            case __1.TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
            default:
                break;
        }
        return ctx.info.prevValue;
    }
    /**
     * 待确认的合约支付消息通知
     * @param transactionDetail
     */
    async toBeConfirmedContractPaymentMessageNotificationHandle(transactionDetail) {
        console.log(transactionDetail.attachInfo.contractId);
        const messageBody = {
            contractId: transactionDetail.attachInfo.contractId,
            eventId: transactionDetail.attachInfo.eventId,
            eventTime: transactionDetail.createDate,
            triggerUserId: 0,
            code: 'S201',
            service: 'freelog',
            name: 'test',
            args: {
                transactionRecordId: transactionDetail.transactionRecordId,
                serialNo: transactionDetail.serialNo,
                transactionStatus: transactionDetail.status,
                transactionAmount: transactionDetail.transactionAmount,
            }
        };
        return this.kafkaClient.send({
            topic: 'contract-fsm-event-trigger-topic', acks: -1,
            messages: [{
                    key: transactionDetail.attachInfo.contractId,
                    value: JSON.stringify(messageBody),
                    headers: { signature: '' }
                }]
        }).then(() => console.log('消息发送成功'));
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", client_1.KafkaClient)
], TransactionNotificationHandler.prototype, "kafkaClient", void 0);
TransactionNotificationHandler = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], TransactionNotificationHandler);
exports.TransactionNotificationHandler = TransactionNotificationHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tbm90aWZpY2F0aW9uLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24tY29yZS1zZXJ2aWNlL3RyYW5zYWN0aW9uLW5vdGlmaWNhdGlvbi1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRTtBQUN0RSwwQkFBb0U7QUFDcEUsbUNBQTZCO0FBQzdCLDRDQUE0QztBQUk1QyxJQUFhLDhCQUE4QixHQUEzQyxNQUFhLDhCQUE4QjtJQUEzQztRQUtJLFVBQUssR0FBRyxnQ0FBZ0MsQ0FBQztJQXNEN0MsQ0FBQztJQXBERzs7O09BR0c7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQXFCO1FBRTlCLE1BQU0sRUFBQyxxQkFBcUIsRUFBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDekMsUUFBUSxxQkFBa0QsRUFBRTtZQUN4RCxLQUFLLDZCQUF5QixDQUFDLDRCQUE0QjtnQkFDdkQsTUFBTSxpQkFBaUIsR0FBRyxjQUFLLENBQXdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzNFLE1BQU0sSUFBSSxDQUFDLHFEQUFxRCxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3BGLE1BQU07WUFDVixLQUFLLDZCQUF5QixDQUFDLGtDQUFrQyxDQUFDO1lBQ2xFLEtBQUssNkJBQXlCLENBQUMsNEJBQTRCLENBQUM7WUFDNUQsS0FBSyw2QkFBeUIsQ0FBQyw4QkFBOEIsQ0FBQztZQUM5RDtnQkFDSSxNQUFNO1NBQ2I7UUFFRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMscURBQXFELENBQUMsaUJBQXdDO1FBQ2hHLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sV0FBVyxHQUFHO1lBQ2hCLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsVUFBVTtZQUNuRCxPQUFPLEVBQUUsaUJBQWlCLENBQUMsVUFBVSxDQUFDLE9BQU87WUFDN0MsU0FBUyxFQUFFLGlCQUFpQixDQUFDLFVBQVU7WUFDdkMsYUFBYSxFQUFFLENBQUM7WUFDaEIsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRTtnQkFDRixtQkFBbUIsRUFBRSxpQkFBaUIsQ0FBQyxtQkFBbUI7Z0JBQzFELFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxRQUFRO2dCQUNwQyxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQyxNQUFNO2dCQUMzQyxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQyxpQkFBaUI7YUFDekQ7U0FDSixDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUN6QixLQUFLLEVBQUUsa0NBQWtDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNuRCxRQUFRLEVBQUUsQ0FBQztvQkFDUCxHQUFHLEVBQUUsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFVBQVU7b0JBQzVDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztvQkFDbEMsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLEVBQUUsRUFBQztpQkFDM0IsQ0FBQztTQUNMLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDSixDQUFBO0FBeERHO0lBREMsa0JBQU0sRUFBRTs4QkFDSSxvQkFBVzttRUFBQztBQUhoQiw4QkFBOEI7SUFGMUMsbUJBQU8sRUFBRTtJQUNULGlCQUFLLENBQUMscUJBQVMsQ0FBQyxTQUFTLENBQUM7R0FDZCw4QkFBOEIsQ0EyRDFDO0FBM0RZLHdFQUE4QiJ9