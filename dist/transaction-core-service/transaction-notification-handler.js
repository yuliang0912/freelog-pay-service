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
        const messageBody = {
            contractId: transactionDetail.attachInfo.contractId,
            eventId: transactionDetail.attachInfo.eventId,
            eventTime: transactionDetail.createDate,
            code: 'S201',
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
        }).then(() => console.log('交易确认消息发送成功'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tbm90aWZpY2F0aW9uLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsidHJhbnNhY3Rpb24tY29yZS1zZXJ2aWNlL3RyYW5zYWN0aW9uLW5vdGlmaWNhdGlvbi1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRTtBQUN0RSwwQkFBb0U7QUFDcEUsbUNBQTZCO0FBQzdCLDRDQUE0QztBQUk1QyxJQUFhLDhCQUE4QixHQUEzQyxNQUFhLDhCQUE4QjtJQUEzQztRQUtJLFVBQUssR0FBRyxnQ0FBZ0MsQ0FBQztJQWtEN0MsQ0FBQztJQWhERzs7O09BR0c7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQXFCO1FBRTlCLE1BQU0sRUFBQyxxQkFBcUIsRUFBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDekMsUUFBUSxxQkFBa0QsRUFBRTtZQUN4RCxLQUFLLDZCQUF5QixDQUFDLDRCQUE0QjtnQkFDdkQsTUFBTSxpQkFBaUIsR0FBRyxjQUFLLENBQXdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzNFLE1BQU0sSUFBSSxDQUFDLHFEQUFxRCxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3BGLE1BQU07WUFDVixLQUFLLDZCQUF5QixDQUFDLGtDQUFrQyxDQUFDO1lBQ2xFLEtBQUssNkJBQXlCLENBQUMsNEJBQTRCLENBQUM7WUFDNUQsS0FBSyw2QkFBeUIsQ0FBQyw4QkFBOEIsQ0FBQztZQUM5RDtnQkFDSSxNQUFNO1NBQ2I7UUFFRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMscURBQXFELENBQUMsaUJBQXdDO1FBQ2hHLE1BQU0sV0FBVyxHQUFHO1lBQ2hCLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsVUFBVTtZQUNuRCxPQUFPLEVBQUUsaUJBQWlCLENBQUMsVUFBVSxDQUFDLE9BQU87WUFDN0MsU0FBUyxFQUFFLGlCQUFpQixDQUFDLFVBQVU7WUFDdkMsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUU7Z0JBQ0YsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsbUJBQW1CO2dCQUMxRCxRQUFRLEVBQUUsaUJBQWlCLENBQUMsUUFBUTtnQkFDcEMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsTUFBTTtnQkFDM0MsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsaUJBQWlCO2FBQ3pEO1NBQ0osQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDekIsS0FBSyxFQUFFLGtDQUFrQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDbkQsUUFBUSxFQUFFLENBQUM7b0JBQ1AsR0FBRyxFQUFFLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxVQUFVO29CQUM1QyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7b0JBQ2xDLE9BQU8sRUFBRSxFQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUM7aUJBQzNCLENBQUM7U0FDTCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0osQ0FBQTtBQXBERztJQURDLGtCQUFNLEVBQUU7OEJBQ0ksb0JBQVc7bUVBQUM7QUFIaEIsOEJBQThCO0lBRjFDLG1CQUFPLEVBQUU7SUFDVCxpQkFBSyxDQUFDLHFCQUFTLENBQUMsU0FBUyxDQUFDO0dBQ2QsOEJBQThCLENBdUQxQztBQXZEWSx3RUFBOEIifQ==