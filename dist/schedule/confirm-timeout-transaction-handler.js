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
var ConfirmTimeoutTransactionHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmTimeoutTransactionHandler = void 0;
const decorator_1 = require("@midwayjs/decorator");
const transaction_core_service_1 = require("../transaction-core-service");
const index_1 = require("../index");
const typeorm_1 = require("typeorm");
let ConfirmTimeoutTransactionHandler = ConfirmTimeoutTransactionHandler_1 = class ConfirmTimeoutTransactionHandler {
    async exec(ctx) {
        const confirmTimeoutRecords = await this.transactionRecordRepository.find({
            where: {
                status: index_1.TransactionStatusEnum.ToBeConfirmation,
                confirmTimeoutDate: typeorm_1.LessThanOrEqual(new Date())
            }
        });
        for (const confirmTimeoutRecord of confirmTimeoutRecords) {
            await this.transactionCoreService.contractPaymentConfirmCanceledHandle(confirmTimeoutRecord);
        }
    }
    static get scheduleOptions() {
        return {
            cron: '0 */10 * * * *',
            type: 'worker',
            immediate: false,
            disable: false
        };
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", transaction_core_service_1.TransactionCoreService)
], ConfirmTimeoutTransactionHandler.prototype, "transactionCoreService", void 0);
__decorate([
    index_1.InjectEntityModel(index_1.TransactionRecordInfo),
    __metadata("design:type", index_1.Repository)
], ConfirmTimeoutTransactionHandler.prototype, "transactionRecordRepository", void 0);
ConfirmTimeoutTransactionHandler = ConfirmTimeoutTransactionHandler_1 = __decorate([
    decorator_1.Provide(),
    decorator_1.Schedule(ConfirmTimeoutTransactionHandler_1.scheduleOptions)
], ConfirmTimeoutTransactionHandler);
exports.ConfirmTimeoutTransactionHandler = ConfirmTimeoutTransactionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybS10aW1lb3V0LXRyYW5zYWN0aW9uLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsic2NoZWR1bGUvY29uZmlybS10aW1lb3V0LXRyYW5zYWN0aW9uLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLG1EQUE4RTtBQUM5RSwwRUFBbUU7QUFDbkUsb0NBQXFHO0FBQ3JHLHFDQUF3QztBQUl4QyxJQUFhLGdDQUFnQyx3Q0FBN0MsTUFBYSxnQ0FBZ0M7SUFPekMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFtQjtRQUMxQixNQUFNLHFCQUFxQixHQUFHLE1BQU0sSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQztZQUN0RSxLQUFLLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFLDZCQUFxQixDQUFDLGdCQUFnQjtnQkFDOUMsa0JBQWtCLEVBQUUseUJBQWUsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO2FBQ2xEO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsS0FBSyxNQUFNLG9CQUFvQixJQUFJLHFCQUFxQixFQUFFO1lBQ3RELE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLG9DQUFvQyxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDaEc7SUFDTCxDQUFDO0lBRUQsTUFBTSxLQUFLLGVBQWU7UUFDdEIsT0FBTztZQUNILElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLEVBQUUsS0FBSztZQUNoQixPQUFPLEVBQUUsS0FBSztTQUNqQixDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUE7QUF4Qkc7SUFEQyxrQkFBTSxFQUFFOzhCQUNlLGlEQUFzQjtnRkFBQztBQUUvQztJQURDLHlCQUFpQixDQUFDLDZCQUFxQixDQUFDOzhCQUNaLGtCQUFVO3FGQUF3QjtBQUx0RCxnQ0FBZ0M7SUFGNUMsbUJBQU8sRUFBRTtJQUNULG9CQUFRLENBQUMsa0NBQWdDLENBQUMsZUFBZSxDQUFDO0dBQzlDLGdDQUFnQyxDQTJCNUM7QUEzQlksNEVBQWdDIn0=